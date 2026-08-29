import { Inject, Injectable } from "@nestjs/common";
import {
  CreateProductInput,
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from "../domain/product.repository.port";
import { Product, ProductDetails } from "../domain/product.entity";

export type CreateProductOutput = Product;

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  execute(input: CreateProductInput): Promise<CreateProductOutput> {
    return this.productRepository.create(ProductDetails.create(input));
  }
}
