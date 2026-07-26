import { Inject, Injectable } from "@nestjs/common";
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
  UpdateProductInput,
} from "../domain/product.repository.port";
import { Product } from "../domain/product.entity";

@Injectable()
export class UpdateProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryPort) {}

  execute(id: string, input: UpdateProductInput): Promise<Product | null> {
    return this.productRepository.update(id, input);
  }
}
