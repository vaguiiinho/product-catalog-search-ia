import { Injectable } from "@nestjs/common";
import { Prisma, Product as PrismaProduct } from "@prisma/client";
import { Product } from "../domain/product.entity";
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
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    return products.map(mapProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? mapProduct(product) : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: new Prisma.Decimal(input.price),
      },
    });

    return mapProduct(product);
  }
}

function mapProduct(product: PrismaProduct): Product {
  return new Product(
    product.id,
    product.name,
    product.description,
    product.price.toNumber(),
    product.createdAt,
    product.updatedAt,
  );
}
