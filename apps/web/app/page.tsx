import { getProducts } from "@/lib/products";
import Link from "next/link";

const features = [
  {
    title: "Busca semantica",
    description: "Encontre produtos por intencao, nao apenas por palavras exatas.",
  },
  {
    title: "Catalogo pronto para portfolio",
    description: "Arquitetura clara, documentacao forte e narrativa tecnica objetiva.",
  },
  {
    title: "Base evolutiva",
    description: "Frontend, API e worker separados para crescer sem acoplamento desnecessario.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function ProductGrid({
  products,
  query,
}: {
  products: Awaited<ReturnType<typeof getProducts>>;
  query?: string;
}) {
  if (products.length === 0) {
    return (
      <section className="catalog-panel">
        <div className="section-header">
          <p className="eyebrow">Catalogo</p>
          <h2>{query ? "Nenhum resultado encontrado." : "Nenhum produto cadastrado ainda."}</h2>
        </div>
        <p className="empty-state">
          {query
            ? `Nao encontramos resultados para "${query}". Tente outra busca.`
            : "O frontend ja conversa com a API. Assim que o seed rodar, os cards aparecem aqui."}
        </p>
      </section>
    );
  }

  return (
    <section className="catalog-panel">
      <div className="section-header">
        <p className="eyebrow">Catalogo</p>
        <h2>Produtos carregados da API NestJS.</h2>
        <p className="section-copy">
          A home agora mostra dados reais do backend, o que fecha o primeiro passo do fluxo
          público do catálogo.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-card-top">
              <p className="product-badge">Produto</p>
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <footer className="product-meta">
              <span>ID {product.id.slice(0, 8)}</span>
              <span>Atualizado {new Date(product.updatedAt).toLocaleDateString("pt-BR")}</span>
            </footer>
            <Link className="product-link" href={`/produto/${product.id}`}>
              Ver detalhe
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let loadError = "";

  try {
    products = await getProducts(q);
  } catch {
    loadError = "Nao foi possivel carregar a API agora. Verifique se o backend esta rodando.";
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Product Catalog Search IA</p>
        <h1>Catalogo de produtos com busca semantica e arquitetura explicita.</h1>
        <p className="lead">
          Next.js no frontend, NestJS na API, PostgreSQL + pgvector nos dados e uma camada de
          IA pronta para demonstrar o fluxo de consulta por intencao.
        </p>

        <form className="search-box" method="get">
          <label className="sr-only" htmlFor="query">
            Buscar produtos
          </label>
          <input
            id="query"
            name="q"
            defaultValue={q}
            placeholder="Ex: tenis leve para corrida urbana"
          />
          <button type="submit">Buscar</button>
        </form>
      </section>

      {loadError ? (
        <section className="catalog-panel">
          <div className="section-header">
            <p className="eyebrow">Conexao</p>
            <h2>Frontend pronto, backend indisponivel.</h2>
          </div>
          <p className="empty-state">{loadError}</p>
        </section>
      ) : (
        <ProductGrid products={products} query={q} />
      )}

      <section className="features">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
