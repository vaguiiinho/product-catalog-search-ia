import { Product } from "./product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
}
