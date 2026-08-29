import { Inject, Injectable } from "@nestjs/common";
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
  UpdateProductInput,
} from "../domain/product.repository.port";
import { Product, ProductDetails } from "../domain/product.entity";
import { EntityId } from "../domain/value-objects/entity-id.value-object";

export type UpdateProductOutput = Product | null;

@Injectable()
export class UpdateProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryPort) {}

  execute(id: string, input: UpdateProductInput): Promise<UpdateProductOutput> {
    const productId = EntityId.create(id, "ID do produto").value;
    return this.productRepository.update(productId, ProductDetails.create(input));
  }
}
