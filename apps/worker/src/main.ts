import { runCatalogIngestionPipeline } from "./ingestion/catalog-ingestion";

async function main() {
  const apiUrl = process.env.INGESTION_API_URL ?? "http://localhost:3001";

  console.log("[worker] ready");
  console.log(`[worker] source=${apiUrl}`);
  console.log("[worker] stage=fetch catalog");

  const { summary } = await runCatalogIngestionPipeline(apiUrl);

  console.log(`[worker] stage=normalize products=${summary.sourceCount}`);
  console.log(`[worker] stage=build-documents documents=${summary.documentCount}`);
  console.log(`[worker] stage=prepare-embeddings categories=${summary.categoryCount}`);

  for (const document of summary.sampleDocuments) {
    console.log(`[worker] sample ${document.productId} -> ${document.title}`);
  }

  console.log("[worker] stage=reindex ready-for-vector-store");
}

void main().catch((error) => {
  console.error("[worker] failed", error);
  process.exitCode = 1;
});
