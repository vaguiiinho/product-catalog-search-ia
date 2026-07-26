import { getApiUrl } from "./api-url";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  attributes: {
    id: string;
    key: string;
    value: string;
  }[];
  images: {
    id: string;
    url: string;
    alt: string;
    position: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

export async function getProductById(id: string): Promise<Product | null> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Falha ao carregar produto: ${response.status}`);
  }

  return response.json() as Promise<Product>;
}
