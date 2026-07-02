import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateProductUseCase } from "../application/create-product.use-case";
import { ListProductsUseCase } from "../application/list-products.use-case";
import { CreateProductDto } from "./dto/create-product.dto";

@Controller("products")
export class CatalogController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Get()
  list() {
    return this.listProductsUseCase.execute();
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
