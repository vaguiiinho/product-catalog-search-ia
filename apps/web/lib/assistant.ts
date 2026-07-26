import { getApiUrl } from "./api-url";

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

export async function askCatalogAssistant(question: string, clientIp?: string): Promise<CatalogAssistantResponse> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/catalog/assistant/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
    },
    body: JSON.stringify({ question }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Falha ao consultar assistente: ${response.status}`);
  }

  return response.json() as Promise<CatalogAssistantResponse>;
}
