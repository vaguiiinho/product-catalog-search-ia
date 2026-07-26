import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/pagination";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Resultados da busca",
  description: "Produtos encontrados na busca do catálogo.",
};

function getPage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const requestedPage = getPage(pageParam);

  if (!query) {
    return (
      <main className="page-shell">
        <section className="hero hero-detail">
          <Link className="back-link" href="/">
            Voltar ao catálogo
          </Link>
          <p className="eyebrow">Busca</p>
          <h1>Informe o que você procura.</h1>
          <form className="search-box" action="/busca">
            <label className="sr-only" htmlFor="search-query">
              Buscar no catálogo
            </label>
            <input id="search-query" name="q" placeholder="Ex: tênis para corrida urbana" autoFocus />
            <button type="submit">Buscar</button>
          </form>
        </section>
      </main>
    );
  }

  try {
    const result = await getProducts(query, requestedPage);
    const paginationHref = (page: number) => `/busca?q=${encodeURIComponent(query)}&page=${page}`;

    return (
      <main className="page-shell">
        <section className="hero hero-detail">
          <div className="detail-topline">
            <Link className="back-link" href="/">
              Voltar ao catálogo
            </Link>
            <span className="detail-id">{result.meta.total} itens encontrados</span>
          </div>
          <p className="eyebrow">Resultados da busca</p>
          <h1>Resultados para “{query}”.</h1>
          <form className="search-box" action="/busca">
            <label className="sr-only" htmlFor="search-query">
              Buscar novamente
            </label>
            <input id="search-query" name="q" defaultValue={query} />
            <button type="submit">Buscar</button>
          </form>
        </section>

        <section className="catalog-panel">
          {result.items.length > 0 ? (
            <>
              <ProductGrid products={result.items} />
              <Pagination page={result.meta.page} totalPages={result.meta.totalPages} hrefForPage={paginationHref} />
            </>
          ) : (
            <p className="empty-state">Nenhum produto corresponde a essa busca. Tente outros termos.</p>
          )}
        </section>
      </main>
    );
  } catch {
    return (
      <main className="page-shell">
        <section className="hero hero-detail">
          <Link className="back-link" href="/">
            Voltar ao catálogo
          </Link>
          <p className="eyebrow">Busca</p>
          <h1>Não foi possível consultar o catálogo.</h1>
          <p className="lead">Verifique se a API está disponível e tente novamente.</p>
        </section>
      </main>
    );
  }
}
