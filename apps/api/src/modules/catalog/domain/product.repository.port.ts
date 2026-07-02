import { Product } from "./product.entity";

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryName?: string;
};

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");

export interface ProductRepositoryPort {
  findAll(query?: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
}
