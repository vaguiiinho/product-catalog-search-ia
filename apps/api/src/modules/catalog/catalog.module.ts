import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { ListProductsUseCase } from "./application/list-products.use-case";
import { CreateProductUseCase } from "./application/create-product.use-case";
import { GetProductUseCase } from "./application/get-product.use-case";
import { UpsertSemanticIndexUseCase } from "./application/upsert-semantic-index.use-case";
import { PRODUCT_REPOSITORY } from "./domain/product.repository.port";
import { PrismaCatalogRepository } from "./infrastructure/prisma-catalog.repository";
import { PrismaService } from "./infrastructure/prisma.service";
import { SemanticIndexService } from "./infrastructure/semantic-index.service";
import { SemanticIndexController } from "./presentation/semantic-index.controller";

@Module({
  controllers: [CatalogController, SemanticIndexController],
  providers: [
    PrismaService,
    PrismaCatalogRepository,
    SemanticIndexService,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: PrismaCatalogRepository,
    },
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpsertSemanticIndexUseCase,
  ],
})
export class CatalogModule {}
