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
    console.log("[bootstrap] schema existente detectado; ignorando prisma db push.");
    return;
  }

  console.log("[bootstrap] banco vazio detectado; criando schema Prisma.");
  execFileSync("./node_modules/.bin/prisma", ["db", "push", "--schema", "prisma/schema.prisma"], {
    stdio: "inherit",
  });
}

main().catch((error) => {
  console.error("[bootstrap] falha ao preparar banco", error);
  process.exitCode = 1;
});
