import {
  persistSemanticIndex,
  runCatalogIngestionPipeline,
} from "./ingestion/catalog-ingestion.js";

async function main() {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";

  console.log("[worker] ready");
  console.log(`[worker] source=${apiUrl}`);
  console.log("[worker] stage=fetch catalog");

  const { summary, embeddedDocuments } = await runCatalogIngestionPipeline(apiUrl);

  console.log(`[worker] stage=normalize products=${summary.sourceCount}`);
  console.log(`[worker] stage=build-documents documents=${summary.documentCount}`);
  console.log(`[worker] stage=prepare-embeddings categories=${summary.categoryCount}`);

  console.log("[worker] stage=store-vectors");
  const result = await persistSemanticIndex(apiUrl, embeddedDocuments);
  console.log(`[worker] stage=store-vectors stored=${result.storedCount}`);

  for (const document of summary.sampleDocuments) {
    console.log(`[worker] sample ${document.productId} -> ${document.title}`);
  }

  console.log("[worker] stage=reindex ready-for-vector-store");
}

void main().catch((error) => {
  if (isConnectionRefused(error)) {
    console.error(
      `[worker] API indisponivel em ${process.env.API_URL ?? "http://localhost:3001"}.
Inicie a API com \`npm run dev:api\` ou defina \`API_URL\` para apontar para uma instancia ativa.`,
    );
  }

  console.error("[worker] failed", error);
  process.exitCode = 1;
});

function isConnectionRefused(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;

  return Boolean(
    cause &&
      typeof cause === "object" &&
      "code" in cause &&
      (cause as { code?: unknown }).code === "ECONNREFUSED",
  );
}
