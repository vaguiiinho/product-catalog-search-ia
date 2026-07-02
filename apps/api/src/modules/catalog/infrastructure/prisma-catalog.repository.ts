import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
} from "../domain/product.entity";
import { CreateProductInput, ProductRepositoryPort } from "../domain/product.repository.port";
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
    const categoryName = input.categoryName?.trim() || "Geral";
    const categorySlug = slugify(categoryName);
    const category = await this.prisma.category.upsert({
      where: { slug: categorySlug },
      update: {
        name: categoryName,
      },
      create: {
        name: categoryName,
        slug: categorySlug,
      },
    });

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
