import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { getProducts, type Product } from "@/lib/products";
import { getApiUrl } from "@/lib/api-url";
import { getCategories, type Category } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Admin",
  description: "Painel administrativo para gerenciar os produtos do catálogo.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function adminUrl(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return `/admin${query ? `?${query}` : ""}`;
}

async function getAdminRequest() {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    redirect("/login?next=/admin");
  }

  const clientIp = requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip") ?? undefined;
  return {
    apiUrl: getApiUrl(),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
    },
  };
}

async function responseError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
  const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
  return message || fallback;
}

function readProductForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price")),
    categoryName: String(formData.get("categoryName") ?? "").trim(),
  };
}

function validateProductInput(product: ReturnType<typeof readProductForm>) {
  return product.name && product.description && Number.isFinite(product.price) && product.price >= 0;
}

async function createProduct(formData: FormData) {
  "use server";

  const page = parsePage(String(formData.get("page") ?? "1"));
  const product = readProductForm(formData);
  if (!validateProductInput(product)) {
    redirect(adminUrl({ page, error: "Preencha nome, descrição e preço válido." }));
  }

  const request = await getAdminRequest();
  const response = await fetch(`${request.apiUrl}/api/products`, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify(product),
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login?error=Sessão expirada. Entre novamente.&next=/admin");
  }
  if (!response.ok) {
    redirect(adminUrl({ page, error: await responseError(response, "Falha ao criar produto.") }));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(adminUrl({ page, created: "1" }));
}

async function updateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const page = parsePage(String(formData.get("page") ?? "1"));
  const product = readProductForm(formData);
  if (!id || !validateProductInput(product)) {
    redirect(adminUrl({ page, error: "Preencha nome, descrição e preço válido." }));
  }

  const request = await getAdminRequest();
  const response = await fetch(`${request.apiUrl}/api/products/${id}`, {
    method: "PATCH",
    headers: request.headers,
    body: JSON.stringify(product),
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login?error=Sessão expirada. Entre novamente.&next=/admin");
  }
  if (!response.ok) {
    redirect(adminUrl({ page, edit: id, error: await responseError(response, "Falha ao atualizar produto.") }));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(adminUrl({ page, updated: "1" }));
}

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const page = parsePage(String(formData.get("page") ?? "1"));
  if (!id) {
    redirect(adminUrl({ page, error: "Produto inválido." }));
  }

  const request = await getAdminRequest();
  const response = await fetch(`${request.apiUrl}/api/products/${id}`, {
    method: "DELETE",
    headers: request.headers,
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login?error=Sessão expirada. Entre novamente.&next=/admin");
  }
  if (!response.ok) {
    redirect(adminUrl({ page, error: await responseError(response, "Falha ao excluir produto.") }));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(adminUrl({ page, deleted: "1" }));
}

function ProductFields({ product, categories }: { product?: Product; categories: Category[] }) {
  return (
    <>
      <label className="admin-field">
        <span>Categoria</span>
        <input
          name="categoryName"
          list="catalog-categories"
          defaultValue={product?.category.name}
          placeholder="Ex: Calçados"
        />
        <datalist id="catalog-categories">
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.productCount} produtos
            </option>
          ))}
        </datalist>
      </label>
      <label className="admin-field">
        <span>Nome</span>
        <input name="name" defaultValue={product?.name} placeholder="Ex: Tênis de trilha resistente" required />
      </label>
      <label className="admin-field">
        <span>Descrição</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          placeholder="Descreva o produto com foco em uso, diferenciais e contexto."
          required
        />
      </label>
      <label className="admin-field">
        <span>Preço</span>
        <input name="price" type="number" min="0" step="0.01" defaultValue={product?.price} placeholder="299.90" required />
      </label>
    </>
  );
}

function AdminProductList({
  products,
  page,
  total,
  totalPages,
  editingId,
  categories,
}: {
  products: Product[];
  page: number;
  total: number;
  totalPages: number;
  editingId?: string;
  categories: Category[];
}) {
  return (
    <section className="admin-panel">
      <div className="section-header">
        <p className="eyebrow">Catálogo da API</p>
        <h2>{total} produtos cadastrados.</h2>
        <p className="section-copy">A listagem é carregada diretamente da API e permite editar ou excluir cada produto.</p>
      </div>

      <div className="admin-list">
        {products.map((product) => (
          <article key={product.id} className="admin-row">
            {editingId === product.id ? (
              <form className="admin-form admin-edit-form" action={updateProduct}>
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="page" value={page} />
                <ProductFields product={product} categories={categories} />
                <div className="admin-row-actions">
                  <button type="submit">Salvar alterações</button>
                  <Link className="admin-action-link" href={adminUrl({ page })}>Cancelar</Link>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category.name}</p>
                  <p>{product.description}</p>
                </div>
                <div className="admin-row-meta">
                  <strong>{formatPrice(product.price)}</strong>
                  <span>{new Date(product.updatedAt).toLocaleDateString("pt-BR")}</span>
                  <div className="admin-row-actions">
                    <Link className="admin-action-link" href={adminUrl({ page, edit: product.id })}>Editar</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="page" value={page} />
                      <button className="admin-delete-button" type="submit">Excluir</button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} hrefForPage={(nextPage) => adminUrl({ page: nextPage })} />
    </section>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string; edit?: string; page?: string }>;
}) {
  const { created, updated, deleted, error, edit, page: pageParam } = await searchParams;
  const requestedPage = parsePage(pageParam);
  let catalog: Awaited<ReturnType<typeof getProducts>> = {
    items: [],
    meta: { page: 1, limit: 9, total: 0, totalPages: 1 },
  };
  let loadError = "";
  let categories: Category[] = [];

  try {
    [catalog, categories] = await Promise.all([getProducts(undefined, requestedPage), getCategories()]);
  } catch {
    loadError = "Não foi possível carregar o catálogo agora. Verifique se a API está online.";
  }

  return (
    <main className="page-shell">
      <section className="hero admin-hero">
        <div className="detail-topline">
          <Link href="/" className="back-link">Voltar ao início</Link>
          <span className="detail-id">Painel administrativo</span>
        </div>
        <p className="eyebrow">Admin</p>
        <h1>Gerencie o catálogo pela API.</h1>
        <p className="lead">Crie, edite e exclua produtos persistidos no PostgreSQL via API NestJS.</p>
        {created ? <p className="success-banner">Produto criado com sucesso.</p> : null}
        {updated ? <p className="success-banner">Produto atualizado com sucesso.</p> : null}
        {deleted ? <p className="success-banner">Produto excluído com sucesso.</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
      </section>

      <section className="admin-panel">
        <div className="section-header">
          <p className="eyebrow">Novo produto</p>
          <h2>Adicionar ao catálogo.</h2>
        </div>
        <form className="admin-form" action={createProduct}>
          <input type="hidden" name="page" value={catalog.meta.page} />
          <ProductFields categories={categories} />
          <button type="submit">Criar produto</button>
        </form>
      </section>

      {loadError ? (
        <section className="admin-panel"><p className="empty-state">{loadError}</p></section>
      ) : (
        <AdminProductList
          products={catalog.items}
          page={catalog.meta.page}
          total={catalog.meta.total}
          totalPages={catalog.meta.totalPages}
          editingId={edit}
          categories={categories}
        />
      )}
    </main>
  );
}
