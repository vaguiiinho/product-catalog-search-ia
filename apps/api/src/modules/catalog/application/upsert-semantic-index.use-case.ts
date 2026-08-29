import { Inject, Injectable } from "@nestjs/common";
import {
  SEMANTIC_INDEX,
  SemanticIndexPort,
  UpsertSemanticIndexInput,
  UpsertSemanticIndexOutput,
} from "./ports/semantic-index.port";

@Injectable()
export class UpsertSemanticIndexUseCase {
  constructor(
    @Inject(SEMANTIC_INDEX)
    private readonly semanticIndex: SemanticIndexPort,
  ) {}

  execute(input: UpsertSemanticIndexInput): Promise<UpsertSemanticIndexOutput> {
    return this.semanticIndex.upsertDocuments(input.documents);
  }
}
