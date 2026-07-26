import { loadApiEnv } from "../src/bootstrap-env";
import { PrismaClient, Prisma } from "@prisma/client";

loadApiEnv();

const prisma = new PrismaClient();

const categories = [
  {
    name: "Calçados",
    slug: "calcados",
  },
  {
    name: "Vestuário",
    slug: "vestuario",
  },
  {
    name: "Bolsas e Acessórios",
    slug: "bolsas-e-acessorios",
  },
  {
    name: "Eletrônicos",
    slug: "eletronicos",
  },
  {
    name: "Casa e Hidratação",
    slug: "casa-e-hidratacao",
  },
];

const products = [
  {
    name: "Tenis leve para corrida",
    description: "Tenis com amortecimento leve para treinos urbanos e corridas curtas.",
    price: new Prisma.Decimal(299.9),
    categorySlug: "calcados",
    attributes: [
      { key: "pisada", value: "neutra" },
      { key: "uso", value: "corrida urbana" },
      { key: "peso", value: "leve" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        alt: "Tenis leve para corrida",
      },
    ],
  },
  {
    name: "Camiseta dry fit premium",
    description: "Camiseta respiravel para atividades fisicas e uso casual.",
    price: new Prisma.Decimal(89.9),
    categorySlug: "vestuario",
    attributes: [
      { key: "tecido", value: "dry fit" },
      { key: "uso", value: "treino e casual" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
        alt: "Camiseta dry fit premium",
      },
    ],
  },
  {
    name: "Mochila urbana minimalista",
    description: "Mochila resistente para notebook, trabalho e deslocamento diario.",
    price: new Prisma.Decimal(219.9),
    categorySlug: "bolsas-e-acessorios",
    attributes: [
      { key: "capacidade", value: "20l" },
      { key: "uso", value: "trabalho e mobilidade" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
        alt: "Mochila urbana minimalista",
      },
    ],
  },
  {
    name: "Relogio esportivo inteligente",
    description: "Relogio com monitoramento de atividade, sono e notificacoes.",
    price: new Prisma.Decimal(549.9),
    categorySlug: "eletronicos",
    attributes: [
      { key: "bateria", value: "longa duração" },
      { key: "monitoramento", value: "atividade e sono" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
        alt: "Relogio esportivo inteligente",
      },
    ],
  },
  {
    name: "Garrafa termica 750ml",
    description: "Garrafa termica para agua quente ou fria com alta durabilidade.",
    price: new Prisma.Decimal(129.9),
    categorySlug: "casa-e-hidratacao",
    attributes: [
      { key: "volume", value: "750ml" },
      { key: "uso", value: "hidratação diária" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
        alt: "Garrafa termica 750ml",
      },
    ],
  },
  {
    name: "Fone sem fio com cancelamento",
    description: "Fone wireless com cancelamento de ruido para foco e mobilidade.",
    price: new Prisma.Decimal(399.9),
    categorySlug: "eletronicos",
    attributes: [
      { key: "conectividade", value: "wireless" },
      { key: "recurso", value: "cancelamento de ruido" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1518441902117-f0a14cfd1d38?auto=format&fit=crop&w=1200&q=80",
        alt: "Fone sem fio com cancelamento",
      },
    ],
  },
];

async function main() {
  await prisma.category.createMany({ data: categories, skipDuplicates: true });

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((category) => [category.slug, category]),
  );

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);

    if (!category) {
      throw new Error(`Categoria nao encontrada para ${product.name}`);
    }

    const existingProduct = await prisma.product.findFirst({ where: { name: product.name } });
    const attributes = withSeedAttributes(product.attributes);
    const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: category.id,
      attributes: { create: attributes },
      images: {
        create: product.images.map((image, index) => ({ ...image, position: index })),
      },
    };

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          ...data,
          attributes: { deleteMany: {}, create: attributes },
          images: {
            deleteMany: {},
            create: product.images.map((image, index) => ({ ...image, position: index })),
          },
        },
      });
    } else {
      await prisma.product.create({ data });
    }
  }

  const randomProductCount = readRandomProductCount();
  const randomProducts = Array.from({ length: randomProductCount }, (_, index) =>
    createRandomProduct(index + 1, categories),
  );

  for (const product of randomProducts) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) {
      throw new Error(`Categoria nao encontrada para ${product.name}`);
    }

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: category.id,
        attributes: { create: withSeedAttributes(product.attributes) },
        images: { create: product.images },
      },
    });
  }

  console.log(
    `Seed concluído: ${products.length} produtos-base atualizados e ${randomProducts.length} produtos aleatórios criados.`,
  );
}

function readRandomProductCount() {
  const countArgument = process.argv.find((argument) => argument.startsWith("--count="));
  const rawCount = countArgument?.slice("--count=".length) ?? "0";
  const count = Number(rawCount);

  if (!Number.isInteger(count) || count < 0 || count > 10_000) {
    throw new Error("A quantidade de produtos aleatórios deve ser um inteiro entre 0 e 10000.");
  }

  return count;
}

function createRandomProduct(index: number, availableCategories: typeof categories) {
  const category = availableCategories[index % availableCategories.length];
  const collections = ["Essencial", "Urbana", "Premium", "Compacta", "Versátil", "Leve"];
  const profile = randomProductProfiles[category.slug];
  const collection = collections[index % collections.length];
  const code = `${Date.now().toString(36)}-${index.toString().padStart(4, "0")}`;
  const name = `${profile.name} ${collection}`;
  const price = 39.9 + ((index * 37) % 760) + 0.01 * (index % 10);

  return {
    name,
    description: profile.description,
    price: new Prisma.Decimal(price.toFixed(2)),
    categorySlug: category.slug,
    attributes: [
      { key: "coleção", value: collection.toLowerCase() },
      { key: "sku", value: `DEMO-${code.toUpperCase()}` },
      ...profile.attributes,
    ],
    images: [
      {
        url: `https://picsum.photos/seed/catalog-${code}/1200/900`,
        alt: name,
        position: 0,
      },
    ],
  };
}

const randomProductProfiles: Record<
  string,
  {
    name: string;
    description: string;
    attributes: Array<{ key: string; value: string }>;
  }
> = {
  calcados: {
    name: "Tênis para Corrida Urbana",
    description:
      "Tênis para corrida urbana, caminhada e treinos diários, com cabedal respirável e amortecimento confortável para percursos curtos e médios.",
    attributes: [
      { key: "uso", value: "corrida, caminhada e treino" },
      { key: "pisada", value: "neutra" },
      { key: "palavras-chave", value: "tênis corrida caminhada treino urbano" },
    ],
  },
  vestuario: {
    name: "Camiseta Esportiva",
    description:
      "Camiseta esportiva de secagem rápida para academia, corrida e uso casual, com tecido leve que favorece a ventilação durante o movimento.",
    attributes: [
      { key: "tecido", value: "dry fit" },
      { key: "uso", value: "academia, corrida e casual" },
      { key: "palavras-chave", value: "camiseta dry fit treino academia corrida" },
    ],
  },
  "bolsas-e-acessorios": {
    name: "Mochila para Trabalho e Viagem",
    description:
      "Mochila versátil para notebook, trabalho, faculdade e viagens curtas, com compartimentos organizados e acabamento resistente para a rotina.",
    attributes: [
      { key: "capacidade", value: "20 litros" },
      { key: "uso", value: "notebook, trabalho e viagem" },
      { key: "palavras-chave", value: "mochila notebook trabalho faculdade viagem" },
    ],
  },
  eletronicos: {
    name: "Fone Sem Fio",
    description:
      "Fone sem fio para música, chamadas e foco no trabalho, com conexão Bluetooth estável e isolamento de ruído para uso em casa, escritório ou deslocamentos.",
    attributes: [
      { key: "conectividade", value: "bluetooth" },
      { key: "uso", value: "música, chamadas e trabalho" },
      { key: "palavras-chave", value: "fone bluetooth sem fio música chamadas trabalho" },
    ],
  },
  "casa-e-hidratacao": {
    name: "Garrafa Térmica",
    description:
      "Garrafa térmica reutilizável para água gelada ou bebidas quentes, indicada para academia, escritório, viagens e hidratação ao longo do dia.",
    attributes: [
      { key: "capacidade", value: "750 ml" },
      { key: "uso", value: "academia, escritório e viagem" },
      { key: "palavras-chave", value: "garrafa térmica água hidratação academia" },
    ],
  },
};

function withSeedAttributes(attributes: Array<{ key: string; value: string }>) {
  const businessAttributes = attributes.filter(
    (attribute) => !["origem", "estoque", "disponibilidade"].includes(attribute.key),
  );

  return [
    ...businessAttributes,
    { key: "origem", value: "demo" },
    { key: "estoque", value: "5 unidades" },
    { key: "disponibilidade", value: "em estoque" },
  ];
}

main()
  .catch((error) => {
    console.error("Seed falhou:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
