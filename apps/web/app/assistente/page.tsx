import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { askCatalogAssistant } from "@/lib/assistant";

export const metadata: Metadata = {
  title: "Assistente do catálogo",
  description: "Resposta assistida com contexto recuperado do catálogo.",
};

function formatShortPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const question = q?.trim();
  let result: Awaited<ReturnType<typeof askCatalogAssistant>> | null = null;
  let error = "";

  if (question) {
    try {
      const requestHeaders = await headers();
      const clientIp = requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip") ?? undefined;
      result = await askCatalogAssistant(question, clientIp);
    } catch (requestError) {
      error = requestError instanceof Error
        ? requestError.message
        : "Não foi possível consultar o assistente agora.";
    }
  }

  return (
    <main className="page-shell">
      <section className="hero hero-detail">
        <div className="detail-topline">
          <Link className="back-link" href="/">
            Voltar ao catálogo
          </Link>
          <Link className="back-link" href="/busca">
            Buscar produtos
          </Link>
        </div>
        <p className="eyebrow">Assistente</p>
        <h1>Pergunte sobre o catálogo.</h1>
        <p className="lead">
          Receba uma resposta baseada nos produtos recuperados, com fallback local quando a IA não estiver disponível.
        </p>
        <form className="assistant-form" action="/assistente">
          <label className="sr-only" htmlFor="assistant-question">
            Perguntar ao assistente
          </label>
          <input
            id="assistant-question"
            name="q"
            defaultValue={question}
            placeholder="Ex: qual produto parece melhor para corrida urbana?"
            autoFocus
          />
          <button type="submit">Perguntar</button>
        </form>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}

      {result ? (
        <section className="assistant-panel">
          <article className="assistant-result assistant-result-page">
            <div className="assistant-result-top">
              <div>
                <p className="eyebrow">Resposta assistida</p>
                <h2>{result.question}</h2>
              </div>
              <span className="assistant-pill">{result.usedFallback ? "Fallback local" : result.model}</span>
            </div>
            <p className="assistant-answer">{result.answer}</p>
            {result.notice ? <p className="assistant-notice">{result.notice}</p> : null}
            <div className="assistant-meta">
              <span>{result.retrievedCount} itens recuperados</span>
              <span>{result.sources.length} fontes citadas</span>
            </div>
            {result.sources.length > 0 ? (
              <div className="assistant-sources">
                {result.sources.map((source) => (
                  <article key={source.id} className="assistant-source-card">
                    <strong>{source.name}</strong>
                    <span>{source.category}</span>
                    <span>{formatShortPrice(source.price)}</span>
                  </article>
                ))}
              </div>
            ) : null}
          </article>
        </section>
      ) : !error ? (
        <section className="assistant-panel">
          <p className="empty-state">Faça uma pergunta para receber recomendações do catálogo.</p>
        </section>
      ) : null}
    </main>
  );
}
