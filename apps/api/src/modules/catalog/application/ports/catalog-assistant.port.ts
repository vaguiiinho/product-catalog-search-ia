export const CATALOG_ASSISTANT = Symbol("CATALOG_ASSISTANT");

export type CatalogAssistantSource = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export type CatalogAssistantResponse = {
  question: string;
  answer: string;
  model: string;
  retrievedCount: number;
  usedFallback: boolean;
  notice?: string;
  sources: CatalogAssistantSource[];
};

export interface CatalogAssistantPort {
  answerQuestion(question: string): Promise<CatalogAssistantResponse>;
}
