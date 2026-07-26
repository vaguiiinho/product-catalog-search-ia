import { Product } from "./product.entity";

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryName?: string;
};

export type UpdateProductInput = CreateProductInput;

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
