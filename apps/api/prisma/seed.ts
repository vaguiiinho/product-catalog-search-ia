import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Tenis leve para corrida",
    description: "Tenis com amortecimento leve para treinos urbanos e corridas curtas.",
    price: new Prisma.Decimal(299.9),
  },
  {
    name: "Camiseta dry fit premium",
    description: "Camiseta respiravel para atividades fisicas e uso casual.",
    price: new Prisma.Decimal(89.9),
  },
  {
    name: "Mochila urbana minimalista",
    description: "Mochila resistente para notebook, trabalho e deslocamento diario.",
    price: new Prisma.Decimal(219.9),
  },
  {
    name: "Relogio esportivo inteligente",
    description: "Relogio com monitoramento de atividade, sono e notificacoes.",
    price: new Prisma.Decimal(549.9),
  },
  {
    name: "Garrafa termica 750ml",
    description: "Garrafa termica para agua quente ou fria com alta durabilidade.",
    price: new Prisma.Decimal(129.9),
  },
  {
    name: "Fone sem fio com cancelamento",
    description: "Fone wireless com cancelamento de ruido para foco e mobilidade.",
    price: new Prisma.Decimal(399.9),
  },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seed concluido com ${products.length} produtos.`);
}

main()
  .catch((error) => {
    console.error("Seed falhou:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
