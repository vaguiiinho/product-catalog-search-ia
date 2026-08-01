const { execFileSync } = require("node:child_process");
const { PrismaClient } = require("@prisma/client");

async function hasCatalogSchema() {
  const prisma = new PrismaClient();

  try {
    const [result] = await prisma.$queryRawUnsafe(
      "SELECT to_regclass('public.\"Product\"') IS NOT NULL AS exists",
    );

    return Boolean(result?.exists);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  if (await hasCatalogSchema()) {
    console.log("[bootstrap] schema existente detectado; aplicando ajustes compatíveis.");
    execFileSync("./node_modules/.bin/prisma", [
      "db",
      "execute",
      "--schema",
      "prisma/schema.prisma",
      "--file",
      "prisma/migrations/20260726170000_category_unique_indexes/migration.sql",
    ], {
      stdio: "inherit",
    });
    return;
  }

  console.log("[bootstrap] banco vazio detectado; aplicando migrations Prisma.");
  execFileSync("./node_modules/.bin/prisma", ["migrate", "deploy", "--schema", "prisma/schema.prisma"], {
    stdio: "inherit",
  });
}

main().catch((error) => {
  console.error("[bootstrap] falha ao preparar banco", error);
  process.exitCode = 1;
});
