import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { ListProductsUseCase } from "./application/list-products.use-case";
import { CreateProductUseCase } from "./application/create-product.use-case";
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

@Module({
  controllers: [CatalogController, SemanticIndexController, CatalogAgentController],
  providers: [
    PrismaService,
    PrismaCatalogRepository,
    SemanticIndexService,
    {
      provide: GROQ_CHAT_MODEL,
      useFactory: createGroqChatModel,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: PrismaCatalogRepository,
    },
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpsertSemanticIndexUseCase,
    CatalogAgentService,
    AskCatalogAgentUseCase,
  ],
})
export class CatalogModule {}
