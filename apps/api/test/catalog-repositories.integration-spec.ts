import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { PrismaCatalogRepository } from "../src/modules/catalog/infrastructure/prisma-catalog.repository";
import { PrismaCategoryRepository } from "../src/modules/catalog/infrastructure/prisma-category.repository";
import { PrismaService } from "../src/modules/catalog/infrastructure/prisma.service";

describe("Prisma catalog repositories", () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaService;
  let products: PrismaCatalogRepository;
  let categories: PrismaCategoryRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("pgvector/pgvector:pg16")
      .withDatabase("catalog_test")
      .withUsername("postgres")
      .withPassword("postgres")
      .start();

    process.env.DATABASE_URL = container.getConnectionUri();
    execFileSync(
      process.execPath,
      [require.resolve("prisma/build/index.js"), "migrate", "deploy", "--schema", resolve("prisma/schema.prisma")],
      { cwd: resolve("."), env: process.env, stdio: "pipe" },
    );

    prisma = new PrismaService();
    await prisma.$connect();
    products = new PrismaCatalogRepository(prisma);
    categories = new PrismaCategoryRepository(prisma);
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE semantic_documents, "ProductImage", "ProductAttribute", "Product", "Category" CASCADE',
    );
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    await container?.stop();
  });

  it("persists, rebuilds and lists an aggregate with UUID identifiers", async () => {
    const created = await products.create({
      name: "Tênis leve",
      description: "Tênis para corrida urbana",
      price: 299.9,
      categoryName: "Calçados",
    });

    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created.category.id).toMatch(/^[0-9a-f-]{36}$/);
    await expect(products.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      category: { name: "Calçados", slug: "calcados" },
    });
    await expect(categories.findAll()).resolves.toEqual([
      expect.objectContaining({ name: "Calçados", productCount: 1 }),
    ]);
  });

  it("updates, searches and deletes a product against PostgreSQL with pgvector", async () => {
    const created = await products.create({
      name: "Mochila Trail",
      description: "Mochila resistente para trilhas",
      price: 249.9,
      categoryName: "Acessórios",
    });

    await expect(
      products.update(created.id, {
        name: "Mochila Trail Pro",
        description: "Mochila resistente para corrida e trilhas",
        price: 289.9,
        categoryName: "Acessórios",
      }),
    ).resolves.toMatchObject({ name: "Mochila Trail Pro", price: 289.9 });
    await expect(products.search("corrida")).resolves.toEqual([
      expect.objectContaining({ id: created.id }),
    ]);
    await expect(products.search("Mochila", { price: 289.9 })).resolves.toEqual([
      expect.objectContaining({ id: created.id, price: 289.9 }),
    ]);
    await expect(products.search("Mochila", { price: 100 })).resolves.toEqual([]);
    await expect(products.delete(created.id)).resolves.toBe(true);
    await expect(products.findById(created.id)).resolves.toBeNull();
  });

  it("returns only exact product-name matches before broader hybrid results", async () => {
    await products.create({
      name: "Garrafa Térmica Urbana",
      description: "Primeira opção urbana",
      price: 332.99,
      categoryName: "Casa e Hidratação",
    });
    await products.create({
      name: "Garrafa Térmica Urbana",
      description: "Segunda opção urbana",
      price: 742.99,
      categoryName: "Casa e Hidratação",
    });
    await products.create({
      name: "Garrafa Térmica Essencial",
      description: "Outra garrafa térmica",
      price: 167.94,
      categoryName: "Casa e Hidratação",
    });

    const result = await products.search("Garrafa Térmica Urbana");

    expect(result).toHaveLength(2);
    expect(result.every((product) => product.name === "Garrafa Térmica Urbana")).toBe(true);
  });
});
