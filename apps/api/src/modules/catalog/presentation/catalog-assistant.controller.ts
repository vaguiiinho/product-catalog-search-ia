import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AskCatalogAgentUseCase } from "../application/ask-catalog-assistant.use-case";
import { AskCatalogAgentDto } from "./dto/ask-catalog-assistant.dto";
import { AssistantRateLimitGuard } from "../../../shared/rate-limit/rate-limit.service";

@Controller("catalog/assistant")
export class CatalogAgentController {
  constructor(private readonly askCatalogAgentUseCase: AskCatalogAgentUseCase) {}

  @Post("ask")
  @UseGuards(AssistantRateLimitGuard)
  ask(@Body() dto: AskCatalogAgentDto) {
    return this.askCatalogAgentUseCase.execute(dto.question);
  }
}
