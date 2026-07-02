import { Controller, Get } from "@nestjs/common";
import { ListProductsUseCase } from "../application/list-products.use-case";

@Controller("products")
export class CatalogController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  @Get()
  list() {
    return this.listProductsUseCase.execute();
  }
}
