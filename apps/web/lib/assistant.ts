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
  sources: CatalogAssistantSource[];
};

const DEFAULT_API_URL = "http://localhost:3001";

export async function askCatalogAssistant(question: string): Promise<CatalogAssistantResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const response = await fetch(`${apiUrl}/api/catalog/assistant/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar assistente: ${response.status}`);
  }

  return response.json() as Promise<CatalogAssistantResponse>;
}
