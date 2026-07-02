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

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Product Catalog Search IA</p>
        <h1>Catalogo de produtos com busca semantica e arquitetura explicita.</h1>
        <p className="lead">
          Next.js no frontend, NestJS na API, PostgreSQL + pgvector nos dados e uma camada de
          IA pronta para demonstrar o fluxo de consulta por intencao.
        </p>

        <form className="search-box">
          <label className="sr-only" htmlFor="query">
            Buscar produtos
          </label>
          <input id="query" name="query" placeholder="Ex: tenis leve para corrida urbana" />
          <button type="submit">Buscar</button>
        </form>
      </section>

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
