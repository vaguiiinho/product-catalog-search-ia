import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { Product } from "../domain/product.entity";
import { ProductSearchQuery } from "../domain/value-objects/product-search-query.value-object";

export type ListProductsInput = {
  query?: string;
  page?: number;
  limit?: number;
};

export type ListProductsOutput = {
  items: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(query?: string, page = 1, limit = 9): Promise<ListProductsOutput> {
    const searchQuery = query?.trim() ? ProductSearchQuery.create(query) : null;
    const products = searchQuery
      ? await (searchQuery.price === undefined
          ? this.productRepository.search(searchQuery.text)
          : this.productRepository.search(searchQuery.text, { price: searchQuery.price }))
      : await this.productRepository.findAll();
    const normalizedPage = Math.max(1, Math.floor(page));
    const normalizedLimit = Math.min(24, Math.max(1, Math.floor(limit)));
    const total = products.length;
    const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));
    const currentPage = Math.min(normalizedPage, totalPages);
    const start = (currentPage - 1) * normalizedLimit;

    return {
      items: products.slice(start, start + normalizedLimit),
      meta: {
        page: currentPage,
        limit: normalizedLimit,
        total,
        totalPages,
      },
    };
  }
}
