import { Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";

@Injectable()
export class ListProductsUseCase {
  execute(): Product[] {
    return [];
  }
}
