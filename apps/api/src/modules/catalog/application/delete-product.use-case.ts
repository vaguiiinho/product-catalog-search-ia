import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { EntityId } from "../domain/value-objects/entity-id.value-object";

export type DeleteProductInput = string;
export type DeleteProductOutput = boolean;

@Injectable()
export class DeleteProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryPort) {}

  execute(id: DeleteProductInput): Promise<DeleteProductOutput> {
    return this.productRepository.delete(EntityId.create(id, "ID do produto").value);
  }
}
