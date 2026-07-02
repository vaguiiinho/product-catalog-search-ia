type CatalogAttribute = {
  id: string;
  key: string;
  value: string;
};

type CatalogImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
};

type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
};

type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CatalogCategory;
  attributes: CatalogAttribute[];
  images: CatalogImage[];
  createdAt: string;
  updatedAt: string;
};

export type IngestionDocument = {
  id: string;
  productId: string;
  title: string;
  semanticText: string;
  facets: Record<string, string[]>;
};

export type IngestionSummary = {
  sourceCount: number;
  documentCount: number;
  categoryCount: number;
  sampleDocuments: IngestionDocument[];
};

const DEFAULT_API_URL = "http://localhost:3001";

export async function fetchCatalog(apiUrl = DEFAULT_API_URL): Promise<CatalogProduct[]> {
  const response = await fetch(`${apiUrl}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar catalogo: ${response.status}`);
  }

  return response.json() as Promise<CatalogProduct[]>;
}

export function normalizeCatalog(products: CatalogProduct[]) {
  return products.map((product) => ({
    ...product,
    categoryName: product.category?.name ?? "Sem categoria",
    attributePairs: product.attributes.map((attribute) => `${attribute.key}: ${attribute.value}`),
    imageCount: product.images.length,
  }));
}

export function buildIngestionDocuments(products: CatalogProduct[]): IngestionDocument[] {
  return products.map((product) => {
    const attributeText = product.attributes
      .map((attribute) => `${attribute.key} ${attribute.value}`)
      .join(" ")
      .trim();

    const imageText = product.images.map((image) => image.alt).join(" ").trim();

    return {
      id: `doc_${product.id}`,
      productId: product.id,
      title: `${product.name} | ${product.category?.name ?? "Sem categoria"}`,
      semanticText: [
        product.name,
        product.description,
        product.category?.name ?? "Sem categoria",
        attributeText,
        imageText,
      ]
        .filter(Boolean)
        .join(" "),
      facets: {
        category: [product.category?.name ?? "Sem categoria"],
        attributes: product.attributes.map((attribute) => `${attribute.key}:${attribute.value}`),
      },
    };
  });
}

export function summarizeIngestion(products: CatalogProduct[], documents: IngestionDocument[]): IngestionSummary {
  const categoryCount = new Set(products.map((product) => product.category?.name ?? "Sem categoria")).size;

  return {
    sourceCount: products.length,
    documentCount: documents.length,
    categoryCount,
    sampleDocuments: documents.slice(0, 2),
  };
}

export async function runCatalogIngestionPipeline(apiUrl = DEFAULT_API_URL) {
  const products = await fetchCatalog(apiUrl);
  const normalized = normalizeCatalog(products);
  const documents = buildIngestionDocuments(products);
  const summary = summarizeIngestion(products, documents);

  return {
    products: normalized,
    documents,
    summary,
  };
}
