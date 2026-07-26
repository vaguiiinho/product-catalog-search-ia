import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
} from "../domain/product.entity";
import {
  CreateProductInput,
  ProductRepositoryPort,
  UpdateProductInput,
} from "../domain/product.repository.port";
import { embedText, toVectorLiteral } from "./semantic-vector";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaCatalogRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: string): Promise<Product[]> {
    const normalizedQuery = query?.trim();
    const products = await this.prisma.product.findMany({
      where: normalizedQuery
        ? {
            OR: [
              { name: { contains: normalizedQuery, mode: "insensitive" } },
              { description: { contains: normalizedQuery, mode: "insensitive" } },
              { category: { is: { name: { contains: normalizedQuery, mode: "insensitive" } } } },
              {
                attributes: {
                  some: {
                    OR: [
                      { key: { contains: normalizedQuery, mode: "insensitive" } },
                      { value: { contains: normalizedQuery, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : undefined,
      include: {
        category: true,
        attributes: true,
        images: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return products.map(mapProduct);
  }

  async search(query: string): Promise<Product[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return this.findAll();
    }

    const queryEmbedding = embedText(normalizedQuery);
    const searchTerms = tokenizeSearchTerms(normalizedQuery);
    const matchTerms = searchTerms.length > 0 ? searchTerms : [normalizedQuery];
    const termConditions = matchTerms.map((term) => Prisma.sql`
          (
            unaccent(p.name) ILIKE '%' || unaccent(${term}) || '%' OR
            unaccent(p.description) ILIKE '%' || unaccent(${term}) || '%' OR
            unaccent(COALESCE(c.name, '')) ILIKE '%' || unaccent(${term}) || '%' OR
            EXISTS (
              SELECT 1
              FROM "ProductAttribute" pa_term
              WHERE pa_term."productId" = p.id
                AND (
                  unaccent(pa_term.key) ILIKE '%' || unaccent(${term}) || '%' OR
                  unaccent(pa_term.value) ILIKE '%' || unaccent(${term}) || '%'
                )
            ) OR
            unaccent(COALESCE(sd.semantic_text, '')) ILIKE '%' || unaccent(${term}) || '%'
          )
        `);
    const termMatchScores = termConditions.map((condition, index) => Prisma.sql`
          CASE WHEN ${condition} THEN ${index === 0 ? 3 : 1} ELSE 0 END
        `);

    const rows = await this.prisma.$queryRaw<
      {
        productId: string;
      }[]
    >`
      WITH query_vector AS (
        SELECT ${toVectorLiteral(queryEmbedding)}::vector(8) AS embedding,
               ${normalizedQuery}::text AS query
      ),
      scored_products AS (
        SELECT
          p.id AS "productId",
          (
            GREATEST(0, 1 - COALESCE(sd.embedding <=> qv.embedding, 1)) * 0.72 +
            (
              CASE WHEN p.name ILIKE '%' || qv.query || '%' THEN 4 ELSE 0 END +
              CASE WHEN p.description ILIKE '%' || qv.query || '%' THEN 3 ELSE 0 END +
              CASE WHEN COALESCE(c.name, '') ILIKE '%' || qv.query || '%' THEN 2 ELSE 0 END +
              COALESCE(attr.attribute_score, 0)
            ) * 0.28
          ) AS "hybridScore",
          (${Prisma.join(termMatchScores, " + ")}) AS "termMatchScore"
        FROM "Product" p
        LEFT JOIN "Category" c ON c.id = p."categoryId"
        LEFT JOIN semantic_documents sd ON sd.product_id = p.id
        CROSS JOIN query_vector qv
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::float * 0.75 AS attribute_score
          FROM "ProductAttribute" pa
          WHERE pa."productId" = p.id
            AND (pa.key ILIKE '%' || qv.query || '%' OR pa.value ILIKE '%' || qv.query || '%')
        ) attr ON true
        WHERE
          ${Prisma.join(termConditions, " OR ")}
        ORDER BY "termMatchScore" DESC, "hybridScore" DESC, p."createdAt" DESC
        LIMIT 20
      )
      SELECT "productId" FROM scored_products
    `;

    const orderedIds = rows.map((row) => row.productId);

    if (orderedIds.length === 0) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: orderedIds,
        },
      },
      include: {
        category: true,
        attributes: true,
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    const byId = new Map(products.map((product) => [product.id, mapProduct(product)]));

    return orderedIds.flatMap((id) => {
      const product = byId.get(id);
      return product ? [product] : [];
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        attributes: true,
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    return product ? mapProduct(product) : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const category = await this.resolveCategory(input.categoryName);

    const product = await this.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        categoryId: category.id,
      },
      include: {
        category: true,
        attributes: true,
        images: true,
      },
    });

    return mapProduct(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return null;
    }

    const category = await this.resolveCategory(input.categoryName);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        categoryId: category.id,
      },
      include: {
        category: true,
        attributes: true,
        images: { orderBy: { position: "asc" } },
      },
    });

    return mapProduct(product);
  }

  async delete(id: string): Promise<boolean> {
    const existingProduct = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existingProduct) {
      return false;
    }

    await this.prisma.product.delete({ where: { id } });
    return true;
  }

  private async resolveCategory(categoryNameInput?: string) {
    const categoryName = categoryNameInput?.trim() || "Geral";
    const categorySlug = slugify(categoryName);

    return this.prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: categorySlug },
    });
  }
}

type ProductRecord = Prisma.ProductGetPayload<{
  include: {
    category: true;
    attributes: true;
    images: true;
  };
}>;

function mapProduct(product: ProductRecord): Product {
  const category = product.category
    ? new ProductCategory(product.category.id, product.category.name, product.category.slug)
    : new ProductCategory("category_unknown", "Sem categoria", "sem-categoria");

  return new Product(
    product.id,
    product.name,
    product.description,
    product.price.toNumber(),
    category,
    product.attributes.map((attribute) => new ProductAttribute(attribute.id, attribute.key, attribute.value)),
    product.images.map((image) => new ProductImage(image.id, image.url, image.alt, image.position)),
    product.createdAt,
    product.updatedAt,
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tokenizeSearchTerms(query: string) {
  const tokens = query.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  return tokens.filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

const STOPWORDS = new Set([
  "qual",
  "quais",
  "como",
  "para",
  "pra",
  "com",
  "sem",
  "sobre",
  "mais",
  "menos",
  "produto",
  "produtos",
  "melhor",
  "pior",
  "parece",
  "parecer",
  "ser",
  "um",
  "uma",
  "os",
  "as",
  "o",
  "a",
]);
