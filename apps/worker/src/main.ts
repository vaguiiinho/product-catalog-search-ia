const tasks = [
  "importacao de catalogo",
  "normalizacao de dados",
  "geracao de embeddings",
  "reindexacao semantica",
];

function main() {
  console.log("[worker] ready");
  for (const task of tasks) {
    console.log(`[worker] ${task}`);
  }
}

main();
