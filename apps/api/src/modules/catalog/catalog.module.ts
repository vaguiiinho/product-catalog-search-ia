import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { ListProductsUseCase } from "./application/list-products.use-case";
import { CreateProductUseCase } from "./application/create-product.use-case";
import { GetProductUseCase } from "./application/get-product.use-case";
import { PRODUCT_REPOSITORY } from "./domain/product.repository.port";
import { PrismaCatalogRepository } from "./infrastructure/prisma-catalog.repository";
import { PrismaService } from "./infrastructure/prisma.service";

@Module({
  controllers: [CatalogController],
  providers: [
    PrismaService,
    PrismaCatalogRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: PrismaCatalogRepository,
    },
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
  ],
})
export class CatalogModule {}
