import { Injectable } from "@nestjs/common";
import { CatalogAssistantResponse, CatalogAgentService } from "../infrastructure/catalog-assistant.service";

@Injectable()
export class AskCatalogAgentUseCase {
  constructor(private readonly catalogAgentService: CatalogAgentService) {}

  execute(question: string): Promise<CatalogAssistantResponse> {
    return this.catalogAgentService.answerQuestion(question);
  }
}
