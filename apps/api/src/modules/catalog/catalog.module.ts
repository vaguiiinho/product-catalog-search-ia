import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { ListProductsUseCase } from "./application/list-products.use-case";

@Module({
  controllers: [CatalogController],
  providers: [ListProductsUseCase],
})
export class CatalogModule {}
