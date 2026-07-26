import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateProductUseCase } from "../application/create-product.use-case";
import { GetProductUseCase } from "../application/get-product.use-case";
import { ListProductsUseCase } from "../application/list-products.use-case";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AdminJwtGuard } from "../../auth/presentation/admin-jwt.guard";
import { ProductsRateLimitGuard } from "../../../shared/rate-limit/rate-limit.service";
import { UpdateProductUseCase } from "../application/update-product.use-case";
import { DeleteProductUseCase } from "../application/delete-product.use-case";

@Controller("products")
export class CatalogController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  list(@Query("q") query?: string, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.listProductsUseCase.execute(query, parsePositiveInteger(page, 1), parsePositiveInteger(limit, 9));
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
  @UseGuards(ProductsRateLimitGuard, AdminJwtGuard)
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @Patch(":id")
  @UseGuards(ProductsRateLimitGuard, AdminJwtGuard)
  async update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    const product = await this.updateProductUseCase.execute(id, dto);
    if (!product) {
      throw new NotFoundException("Produto nao encontrado");
    }
    return product;
  }

  @Delete(":id")
  @UseGuards(ProductsRateLimitGuard, AdminJwtGuard)
  async remove(@Param("id") id: string) {
    const deleted = await this.deleteProductUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException("Produto nao encontrado");
    }
  }
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
