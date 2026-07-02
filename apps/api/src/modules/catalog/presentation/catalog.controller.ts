import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { CreateProductUseCase } from "../application/create-product.use-case";
import { GetProductUseCase } from "../application/get-product.use-case";
import { ListProductsUseCase } from "../application/list-products.use-case";
import { CreateProductDto } from "./dto/create-product.dto";

@Controller("products")
export class CatalogController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Get()
  list() {
    return this.listProductsUseCase.execute();
  }

  @Get(":id")
  async detail(@Param("id") id: string) {
    const product = await this.getProductUseCase.execute(id);

    if (!product) {
      throw new NotFoundException("Produto nao encontrado");
    }

    return product;
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
