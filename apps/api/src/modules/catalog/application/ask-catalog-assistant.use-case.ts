import { Inject, Injectable } from "@nestjs/common";
import { DomainError } from "../domain/domain.error";
import { RequiredText } from "../domain/value-objects/required-text.value-object";
import {
  CATALOG_ASSISTANT,
  CatalogAssistantPort,
  CatalogAssistantResponse,
} from "./ports/catalog-assistant.port";

export type AskCatalogAgentInput = string;
export type AskCatalogAgentOutput = CatalogAssistantResponse;

@Injectable()
export class AskCatalogAgentUseCase {
  constructor(
    @Inject(CATALOG_ASSISTANT)
    private readonly catalogAssistant: CatalogAssistantPort,
  ) {}

  execute(question: AskCatalogAgentInput): Promise<AskCatalogAgentOutput> {
    const normalizedQuestion = RequiredText.create(question, "Pergunta", 500).value;
    if (normalizedQuestion.length < 3) {
      throw new DomainError("Pergunta deve ter pelo menos tres caracteres.");
    }
    return this.catalogAssistant.answerQuestion(normalizedQuestion);
  }
}
