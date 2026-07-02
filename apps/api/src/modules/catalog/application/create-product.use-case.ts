import { Inject, Injectable } from "@nestjs/common";
import {
  CreateProductInput,
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from "../domain/product.repository.port";
import { Product } from "../domain/product.entity";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  execute(input: CreateProductInput): Promise<Product> {
    return this.productRepository.create(input);
  }
}
