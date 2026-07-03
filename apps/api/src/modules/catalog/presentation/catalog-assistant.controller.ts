import { Body, Controller, Post } from "@nestjs/common";
import { AskCatalogAgentUseCase } from "../application/ask-catalog-assistant.use-case";
import { AskCatalogAgentDto } from "./dto/ask-catalog-assistant.dto";

@Controller("catalog/assistant")
export class CatalogAgentController {
  constructor(private readonly askCatalogAgentUseCase: AskCatalogAgentUseCase) {}

  @Post("ask")
  ask(@Body() dto: AskCatalogAgentDto) {
    return this.askCatalogAgentUseCase.execute(dto.question);
  }
}
