import { Injectable } from "@nestjs/common";
import { CatalogAssistantResponse, CatalogAssistantService } from "../infrastructure/catalog-assistant.service";

@Injectable()
export class AskCatalogAssistantUseCase {
  constructor(private readonly catalogAssistantService: CatalogAssistantService) {}

  execute(question: string): Promise<CatalogAssistantResponse> {
    return this.catalogAssistantService.answerQuestion(question);
  }
}

