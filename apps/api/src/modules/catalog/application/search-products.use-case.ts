import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  execute(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }
}
