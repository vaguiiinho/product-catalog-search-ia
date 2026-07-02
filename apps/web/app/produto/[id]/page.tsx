import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Produto nao encontrado",
      description: "Detalhe do produto indisponivel no catalogo.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="hero hero-detail">
        <div className="detail-topline">
          <Link href="/" className="back-link">
            Voltar ao catalogo
          </Link>
          <Link href="/admin" className="back-link">
            Abrir admin
          </Link>
        </div>

        <p className="eyebrow">Detalhe do produto</p>
        <h1>{product.name}</h1>
        <span className="detail-id">ID {product.id}</span>
        <p className="lead">{product.description}</p>

        <div className="detail-grid">
          <article className="detail-stat">
            <span>Preco</span>
            <strong>{formatPrice(product.price)}</strong>
          </article>
          <article className="detail-stat">
            <span>Criado em</span>
            <strong>{new Date(product.createdAt).toLocaleDateString("pt-BR")}</strong>
          </article>
          <article className="detail-stat">
            <span>Atualizado em</span>
            <strong>{new Date(product.updatedAt).toLocaleDateString("pt-BR")}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}
