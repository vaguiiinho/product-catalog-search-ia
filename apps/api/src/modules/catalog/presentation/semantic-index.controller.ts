import { Body, Controller, Post } from "@nestjs/common";
import { UpsertSemanticIndexUseCase } from "../application/upsert-semantic-index.use-case";
import { UpsertSemanticIndexDto } from "./dto/upsert-semantic-index.dto";

@Controller("catalog/semantic-index")
export class SemanticIndexController {
  constructor(private readonly upsertSemanticIndexUseCase: UpsertSemanticIndexUseCase) {}

  @Post()
  upsert(@Body() dto: UpsertSemanticIndexDto) {
    return this.upsertSemanticIndexUseCase.execute(dto);
  }
}
