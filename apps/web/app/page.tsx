import type { Metadata } from "next";
import { askCatalogAssistant } from "@/lib/assistant";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Catalogo publico com busca semantica simulada, ranking heuristico e painel administrativo.",
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function formatShortPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

type RankedProduct = Awaited<ReturnType<typeof getProducts>>[number] & {
  score: number;
  relevanceLabel: string;
  relevanceNote: string;
};

function rankProducts(products: Awaited<ReturnType<typeof getProducts>>, query?: string) {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) {
    return products.map((product) => ({
      ...product,
      score: 0,
      relevanceLabel: "Ordenado por data",
      relevanceNote: "Sem busca aplicada; exibindo os resultados mais recentes.",
    }));
  }

  const terms = normalizedQuery.split(/\s+/).filter((term) => term.length > 2);

  return products
    .map((product) => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const categoryName = product.category.name.toLowerCase();
      const attributeText = product.attributes
        .map((attribute) => `${attribute.key} ${attribute.value}`.toLowerCase())
        .join(" ");

      let score = 0;

      if (name.includes(normalizedQuery)) {
        score += 40;
      }

      if (description.includes(normalizedQuery)) {
        score += 20;
      }

      if (categoryName.includes(normalizedQuery)) {
        score += 16;
      }

      for (const term of terms) {
        if (name.includes(term)) {
          score += 8;
        }

        if (description.includes(term)) {
          score += 3;
        }

        if (categoryName.includes(term)) {
          score += 5;
        }

        if (attributeText.includes(term)) {
          score += 2;
        }
      }

      const relevanceLabel =
        score >= 50 ? "Alta relevância" : score >= 20 ? "Relevância média" : "Relevância parcial";

      const relevanceNote = name.includes(normalizedQuery)
        ? "O nome do produto bate com a busca."
        : description.includes(normalizedQuery)
          ? "A descrição reforça essa correspondência."
          : categoryName.includes(normalizedQuery)
            ? "A categoria do produto bate com a busca."
          : terms.some((term) => name.includes(term))
            ? "Parte dos termos aparece no nome."
            : "Há correspondência parcial na descrição.";

      return {
        ...product,
        score,
        relevanceLabel,
        relevanceNote,
      };
    });
}

function ProductGrid({
  products,
  query,
}: {
  products: RankedProduct[];
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
            : "O frontend ja conversa com a API e exibe a base pronta para a demo de embeddings e pgvector."}
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
          A home mostra a base real do backend e a narrativa da demo com busca semantica
          simulada sobre sistema existente.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-card-top">
              <p className="product-badge">{product.relevanceLabel}</p>
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>
            <h3>{product.name}</h3>
            <p className="product-category">{product.category.name}</p>
            <p>{product.description}</p>
            <div className="product-attributes">
              {product.attributes.slice(0, 3).map((attribute) => (
                <span key={attribute.id} className="attribute-chip">
                  {attribute.key}: {attribute.value}
                </span>
              ))}
            </div>
            <p className="product-relevance">{product.relevanceNote}</p>
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
  searchParams: Promise<{ q?: string; ask?: string }>;
}) {
  const { q, ask } = await searchParams;
  let products: RankedProduct[] = [];
  let loadError = "";
  let assistantError = "";
  let assistantResult: Awaited<ReturnType<typeof askCatalogAssistant>> | null = null;

  try {
    products = rankProducts(await getProducts(q), q);
  } catch {
    loadError = "Nao foi possivel carregar a API agora. Verifique se o backend esta rodando.";
  }

  if (ask?.trim()) {
    try {
      assistantResult = await askCatalogAssistant(ask.trim());
    } catch {
      assistantError = "Nao foi possivel consultar o assistente agora. Verifique se a API esta rodando.";
    }
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
          gera embeddings para demonstrar a orquestracao de LLM e RAG sobre uma base existente.
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
        {q ? (
          <p className="search-hint">
            Ordenando resultados por relevancia para <strong>{q}</strong>.
          </p>
        ) : null}
      </section>

      <section className="assistant-panel">
        <div className="section-header">
          <p className="eyebrow">Assistente</p>
          <h2>Pergunte sobre o catalogo com a camada de RAG.</h2>
          <p className="section-copy">
            Quando a chave da Groq estiver configurada, a resposta vem do modelo. Sem chave, a
            interface mostra o fallback local com o mesmo contexto recuperado do catalogo.
          </p>
        </div>

        <form className="assistant-form" method="get">
          <label className="sr-only" htmlFor="ask">
            Perguntar ao assistente
          </label>
          {q ? <input type="hidden" name="q" value={q} /> : null}
          <input
            id="ask"
            name="ask"
            defaultValue={ask}
            placeholder="Ex: qual produto parece melhor para corrida urbana?"
          />
          <button type="submit">Perguntar</button>
        </form>

        {assistantError ? <p className="empty-state">{assistantError}</p> : null}

        {assistantResult ? (
          <article className="assistant-result">
            <div className="assistant-result-top">
              <div>
                <p className="eyebrow">Resposta assistida</p>
                <h3>{assistantResult.question}</h3>
              </div>
              <span className="assistant-pill">
                {assistantResult.usedFallback ? "Fallback local" : assistantResult.model}
              </span>
            </div>
            <p className="assistant-answer">{assistantResult.answer}</p>
            <div className="assistant-meta">
              <span>{assistantResult.retrievedCount} itens recuperados</span>
              <span>{assistantResult.sources.length} fontes citadas</span>
            </div>
            {assistantResult.sources.length > 0 ? (
              <div className="assistant-sources">
                {assistantResult.sources.map((source) => (
                  <article key={source.id} className="assistant-source-card">
                    <strong>{source.name}</strong>
                    <span>{source.category}</span>
                    <span>{formatShortPrice(source.price)}</span>
                  </article>
                ))}
              </div>
            ) : null}
          </article>
        ) : (
          <p className="empty-state">
            Envie uma pergunta para ver o contexto recuperado e a resposta assistida.
          </p>
        )}
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
