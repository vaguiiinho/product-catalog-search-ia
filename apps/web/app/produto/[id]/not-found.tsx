import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Produto indisponivel</p>
        <h1>Este produto nao foi encontrado.</h1>
        <p className="lead">Ele pode ter sido removido ou o identificador está incorreto.</p>
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
