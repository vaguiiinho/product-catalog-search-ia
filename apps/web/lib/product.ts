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

const DEFAULT_API_URL = "http://localhost:3001";

export async function getProductById(id: string): Promise<Product | null> {
  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
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
