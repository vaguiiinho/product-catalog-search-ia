import { Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository?: ProductRepository) {}

  async execute(): Promise<Product[]> {
    if (!this.productRepository) {
      return [];
    }

    return this.productRepository.findAll();
  }
}
