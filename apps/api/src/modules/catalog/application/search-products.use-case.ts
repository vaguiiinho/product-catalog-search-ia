import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { ProductSearchQuery } from "../domain/value-objects/product-search-query.value-object";

export type SearchProductsInput = string;
export type SearchProductsOutput = Product[];

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  execute(query: SearchProductsInput): Promise<SearchProductsOutput> {
    const searchQuery = ProductSearchQuery.create(query);
    return searchQuery.price === undefined
      ? this.productRepository.search(searchQuery.text)
      : this.productRepository.search(searchQuery.text, { price: searchQuery.price });
  }
}
