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

import { getApiUrl } from "./api-url";

export type ProductPage = {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getProducts(query?: string, page = 1): Promise<ProductPage> {
  const apiUrl = getApiUrl();
  const searchParams = new URLSearchParams();

  if (query?.trim()) {
    searchParams.set("q", query.trim());
  }
  searchParams.set("page", String(page));

  const response = await fetch(
    `${apiUrl}/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Falha ao carregar produtos: ${response.status}`);
  }

  return response.json() as Promise<ProductPage>;
}
