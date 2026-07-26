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
    const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: category.id,
      attributes: { create: product.attributes },
      images: {
        create: product.images.map((image, index) => ({ ...image, position: index })),
      },
    };

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          ...data,
          attributes: { deleteMany: {}, create: product.attributes },
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
        attributes: { create: product.attributes },
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
  const adjectives = ["Essencial", "Urbano", "Premium", "Compacto", "Versátil", "Leve"];
  const nouns = ["Kit", "Modelo", "Seleção", "Edição", "Coleção", "Item"];
  const adjective = adjectives[index % adjectives.length];
  const noun = nouns[(index * 3) % nouns.length];
  const code = `${Date.now().toString(36)}-${index.toString().padStart(4, "0")}`;
  const name = `${noun} ${adjective} ${code}`;
  const price = 39.9 + ((index * 37) % 760) + 0.01 * (index % 10);

  return {
    name,
    description: `${name}, produto gerado para testes do catálogo na categoria ${category.name}.`,
    price: new Prisma.Decimal(price.toFixed(2)),
    categorySlug: category.slug,
    attributes: [
      { key: "origem", value: "seed aleatória" },
      { key: "coleção", value: adjective.toLowerCase() },
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

main()
  .catch((error) => {
    console.error("Seed falhou:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
