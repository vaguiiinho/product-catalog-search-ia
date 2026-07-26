import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(query?: string, page = 1, limit = 9) {
    const products = query?.trim()
      ? await this.productRepository.search(query)
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
