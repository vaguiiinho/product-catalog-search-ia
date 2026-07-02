import { Injectable } from "@nestjs/common";
import { SemanticIndexService } from "../infrastructure/semantic-index.service";
import { UpsertSemanticIndexInput } from "../presentation/dto/upsert-semantic-index.dto";

@Injectable()
export class UpsertSemanticIndexUseCase {
  constructor(private readonly semanticIndexService: SemanticIndexService) {}

  execute(input: UpsertSemanticIndexInput) {
    return this.semanticIndexService.upsertDocuments(input.documents);
  }
}
