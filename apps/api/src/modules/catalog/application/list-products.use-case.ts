import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(query?: string): Promise<Product[]> {
    return this.productRepository.findAll(query);
  }
}
