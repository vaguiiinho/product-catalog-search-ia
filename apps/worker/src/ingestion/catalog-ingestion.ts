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

export type EmbeddedIngestionDocument = IngestionDocument & {
  embedding: number[];
};

export type IngestionSummary = {
  sourceCount: number;
  documentCount: number;
  categoryCount: number;
  sampleDocuments: IngestionDocument[];
};

export async function fetchCatalog(apiUrl: string): Promise<CatalogProduct[]> {
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

export function embedDocument(document: IngestionDocument): EmbeddedIngestionDocument {
  return {
    ...document,
    embedding: embedText(document.semanticText),
  };
}

export function embedDocuments(documents: IngestionDocument[]): EmbeddedIngestionDocument[] {
  return documents.map(embedDocument);
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

export async function runCatalogIngestionPipeline(apiUrl: string) {
  const products = await fetchCatalog(apiUrl);
  const normalized = normalizeCatalog(products);
  const documents = buildIngestionDocuments(products);
  const embeddedDocuments = embedDocuments(documents);
  const summary = summarizeIngestion(products, documents);

  return {
    products: normalized,
    documents,
    embeddedDocuments,
    summary,
  };
}

function embedText(text: string, dimensions = 8) {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  for (const token of tokens) {
    let hash = 0;

    for (let index = 0; index < token.length; index += 1) {
      hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
    }

    vector[hash % dimensions] += token.length;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;

  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

export async function persistSemanticIndex(
  apiUrl: string,
  documents: EmbeddedIngestionDocument[],
) {
  const response = await fetch(`${apiUrl}/api/catalog/semantic-index`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documents,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao persistir index semantico: ${response.status}`);
  }

  return response.json() as Promise<{ storedCount: number }>;
}
