import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { ListProductsUseCase } from "./application/list-products.use-case";
import { CreateProductUseCase } from "./application/create-product.use-case";
import { UpdateProductUseCase } from "./application/update-product.use-case";
import { DeleteProductUseCase } from "./application/delete-product.use-case";
import { GetProductUseCase } from "./application/get-product.use-case";
import { UpsertSemanticIndexUseCase } from "./application/upsert-semantic-index.use-case";
import { AskCatalogAgentUseCase } from "./application/ask-catalog-assistant.use-case";
import { PRODUCT_REPOSITORY } from "./domain/product.repository.port";
import { CatalogAgentService } from "./infrastructure/catalog-assistant.service";
import { createGroqChatModel, GROQ_CHAT_MODEL } from "./infrastructure/groq-chat-model.provider";
import { PrismaCatalogRepository } from "./infrastructure/prisma-catalog.repository";
import { PrismaService } from "./infrastructure/prisma.service";
import { SemanticIndexService } from "./infrastructure/semantic-index.service";
import { CatalogAgentController } from "./presentation/catalog-assistant.controller";
import { SemanticIndexController } from "./presentation/semantic-index.controller";
import { AuthModule } from "../auth/auth.module";
import { CategoriesController } from "./presentation/categories.controller";
import { ListCategoriesUseCase } from "./application/list-categories.use-case";
import { CATEGORY_REPOSITORY } from "./domain/category.repository.port";
import { PrismaCategoryRepository } from "./infrastructure/prisma-category.repository";
import { CATALOG_ASSISTANT } from "./application/ports/catalog-assistant.port";
import { SEMANTIC_INDEX } from "./application/ports/semantic-index.port";

@Module({
  imports: [AuthModule],
  controllers: [CatalogController, CategoriesController, SemanticIndexController, CatalogAgentController],
  providers: [
    PrismaService,
    PrismaCatalogRepository,
    PrismaCategoryRepository,
    SemanticIndexService,
    {
      provide: GROQ_CHAT_MODEL,
      useFactory: createGroqChatModel,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: PrismaCatalogRepository,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useExisting: PrismaCategoryRepository,
    },
    {
      provide: CATALOG_ASSISTANT,
      useExisting: CatalogAgentService,
    },
    {
      provide: SEMANTIC_INDEX,
      useExisting: SemanticIndexService,
    },
    ListProductsUseCase,
    ListCategoriesUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    UpsertSemanticIndexUseCase,
    CatalogAgentService,
    AskCatalogAgentUseCase,
  ],
})
export class CatalogModule {}
