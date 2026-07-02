import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProducts, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Painel administrativo básico para criar produtos e inspecionar o catálogo recente.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const categoryName = String(formData.get("categoryName") ?? "").trim();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  if (!name || !description || Number.isNaN(price) || price < 0) {
    redirect("/admin?error=Preencha nome, descricao e preco valido.");
  }

  const response = await fetch(`${apiUrl}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      price,
      categoryName,
    }),
  });

  if (!response.ok) {
    redirect("/admin?error=Falha ao criar produto.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

function AdminProductList({ products }: { products: Product[] }) {
  return (
    <section className="admin-panel">
      <div className="section-header">
        <p className="eyebrow">Catalogo recente</p>
        <h2>Ultimos produtos da base.</h2>
        <p className="section-copy">
          O painel mostra o estado atual do catálogo e permite criar novos itens sem sair da UI.
        </p>
      </div>

      <div className="admin-list">
        {products.map((product) => (
          <article key={product.id} className="admin-row">
            <div>
              <h3>{product.name}</h3>
              <p className="product-category">{product.category.name}</p>
              <p>{product.description}</p>
            </div>
            <div className="admin-row-meta">
              <strong>{formatPrice(product.price)}</strong>
              <span>{new Date(product.updatedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const { created, error } = await searchParams;
  let products: Product[] = [];
  let loadError = "";

  try {
    products = await getProducts();
  } catch {
    loadError = "Nao foi possivel carregar o catalogo agora. Verifique se a API esta online.";
  }

  return (
    <main className="page-shell">
      <section className="hero admin-hero">
        <div className="detail-topline">
          <Link href="/" className="back-link">
            Voltar ao catalogo
          </Link>
          <span className="detail-id">Painel administrativo</span>
        </div>

        <p className="eyebrow">Admin</p>
        <h1>Gerencie o catalogo com uma interface simples e util.</h1>
        <p className="lead">
          Criação de produtos diretamente no catálogo principal, com persistência em PostgreSQL via
          API NestJS.
        </p>

        {created ? <p className="success-banner">Produto criado com sucesso.</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
      </section>

      <section className="admin-panel">
        <div className="section-header">
          <p className="eyebrow">Novo produto</p>
          <h2>Criar item no catálogo.</h2>
          <p className="section-copy">
            A submissão acontece via server action, então o browser não precisa falar direto com a
            API.
          </p>
        </div>

        <form className="admin-form" action={createProduct}>
          <label className="admin-field">
            <span>Categoria</span>
            <input name="categoryName" placeholder="Ex: Calçados" />
          </label>

          <label className="admin-field">
            <span>Nome</span>
            <input name="name" placeholder="Ex: Tênis de trilha resistente" />
          </label>

          <label className="admin-field">
            <span>Descrição</span>
            <textarea
              name="description"
              rows={4}
              placeholder="Descreva o produto com foco em uso, diferenciais e contexto."
            />
          </label>

          <label className="admin-field">
            <span>Preço</span>
            <input name="price" type="number" min="0" step="0.01" placeholder="299.90" />
          </label>

          <button type="submit">Criar produto</button>
        </form>
      </section>

      {loadError ? (
        <section className="admin-panel">
          <div className="section-header">
            <p className="eyebrow">Catalogo recente</p>
            <h2>Catalogo indisponivel.</h2>
          </div>
          <p className="empty-state">{loadError}</p>
        </section>
      ) : (
        <AdminProductList products={products} />
      )}
    </main>
  );
}
