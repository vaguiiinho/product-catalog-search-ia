import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">404</p>
        <h1>Pagina nao encontrada.</h1>
        <p className="lead">O caminho solicitado nao existe neste catálogo.</p>
        <div className="not-found-actions">
          <Link href="/" className="back-link">
            Voltar ao catalogo
          </Link>
          <Link href="/admin" className="back-link">
            Abrir admin
          </Link>
        </div>
      </section>
    </main>
  );
}
