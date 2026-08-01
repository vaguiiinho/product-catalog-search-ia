import { getApiUrl } from "./api-url";

export type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${getApiUrl()}/api/categories`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Falha ao carregar categorias: ${response.status}`);
  }

  return response.json() as Promise<Category[]>;
}
