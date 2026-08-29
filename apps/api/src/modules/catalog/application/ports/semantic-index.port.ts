export const SEMANTIC_INDEX = Symbol("SEMANTIC_INDEX");

export type SemanticDocumentInput = {
  id: string;
  productId: string;
  title: string;
  semanticText: string;
  facets: Record<string, string[]>;
  embedding: number[];
};

export type UpsertSemanticIndexInput = {
  documents: SemanticDocumentInput[];
};

export type UpsertSemanticIndexOutput = { storedCount: number };

export interface SemanticIndexPort {
  upsertDocuments(documents: SemanticDocumentInput[]): Promise<UpsertSemanticIndexOutput>;
}
