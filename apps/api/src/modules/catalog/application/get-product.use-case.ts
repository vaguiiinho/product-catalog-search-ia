import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { EntityId } from "../domain/value-objects/entity-id.value-object";

export type GetProductInput = string;
export type GetProductOutput = Product | null;

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  execute(id: GetProductInput): Promise<GetProductOutput> {
    return this.productRepository.findById(EntityId.create(id, "ID do produto").value);
  }
}
