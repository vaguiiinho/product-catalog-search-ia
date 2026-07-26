import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";

@Injectable()
export class DeleteProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryPort) {}

  execute(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
