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

type ProductListResponse = Product[];

const DEFAULT_API_URL = "http://localhost:3001";

export async function getProducts(query?: string): Promise<ProductListResponse> {
  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const searchParams = new URLSearchParams();

  if (query?.trim()) {
    searchParams.set("q", query.trim());
  }

  const response = await fetch(
    `${apiUrl}/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Falha ao carregar produtos: ${response.status}`);
  }

  return response.json() as Promise<ProductListResponse>;
}
