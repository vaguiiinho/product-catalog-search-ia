import { Body, Controller, Post } from "@nestjs/common";
import { AskCatalogAssistantUseCase } from "../application/ask-catalog-assistant.use-case";
import { AskCatalogAssistantDto } from "./dto/ask-catalog-assistant.dto";

@Controller("catalog/assistant")
export class CatalogAssistantController {
  constructor(private readonly askCatalogAssistantUseCase: AskCatalogAssistantUseCase) {}

  @Post("ask")
  ask(@Body() dto: AskCatalogAssistantDto) {
    return this.askCatalogAssistantUseCase.execute(dto.question);
  }
}

