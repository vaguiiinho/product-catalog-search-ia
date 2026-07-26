import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Catalogo publico com busca semantica, assistente em runtime e painel administrativo.",
};

const features = [
  {
    title: "Busca semantica",
    description: "Encontre produtos por intencao usando embeddings locais e pgvector.",
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  let catalog: Awaited<ReturnType<typeof getProducts>> = {
    items: [],
    meta: { page: 1, limit: 9, total: 0, totalPages: 1 },
  };
  let loadError = "";

  try {
    catalog = await getProducts(undefined, page);
  } catch {
    loadError = "Nao foi possivel carregar a API agora. Verifique se o backend esta rodando.";
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="detail-topline">
          <span className="detail-id">Frontend publico</span>
          <Link className="back-link" href="/admin">
            Abrir admin
          </Link>
        </div>
        <p className="eyebrow">Product Catalog Search IA</p>
        <h1>Catalogo de produtos com busca semantica e integracao simulada de IA.</h1>
        <p className="lead">
          Next.js no frontend, NestJS na API, PostgreSQL + pgvector nos dados e um worker que
          gera embeddings para demonstrar a orquestracao de RAG em runtime sobre uma base
          existente.
        </p>
      </section>

      <section className="assistant-panel">
        <div className="section-header">
          <p className="eyebrow">Assistente</p>
          <h2>Pergunte sobre o catálogo com a camada de RAG em runtime.</h2>
          <p className="section-copy">
            O assistente recupera contexto do catalogo, aciona o modelo Groq quando configurado e
            abre uma página dedicada com a resposta e as fontes encontradas.
          </p>
        </div>

        <form className="assistant-form" action="/assistente">
          <label className="sr-only" htmlFor="assistant-question">
            Perguntar ao assistente
          </label>
          <input
            id="assistant-question"
            name="q"
            placeholder="Ex: qual produto parece melhor para corrida urbana?"
          />
          <button type="submit">Perguntar</button>
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
        <section className="catalog-panel">
          <div className="section-header">
            <p className="eyebrow">Catálogo</p>
            <h2>Produtos carregados da API NestJS.</h2>
            <p className="section-copy">{catalog.meta.total} itens disponíveis no catálogo.</p>
          </div>
          {catalog.items.length > 0 ? (
            <>
              <ProductGrid products={catalog.items} />
              <Pagination page={catalog.meta.page} totalPages={catalog.meta.totalPages} hrefForPage={(nextPage) => `/?page=${nextPage}`} />
            </>
          ) : (
            <p className="empty-state">Nenhum produto cadastrado ainda.</p>
          )}
        </section>
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
