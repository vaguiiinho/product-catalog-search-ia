import Link from "next/link";
import type { Product } from "@/lib/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article key={product.id} className="product-card">
          <div className="product-card-top">
            <p className="product-badge">{product.category.name}</p>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="product-attributes">
            {product.attributes.slice(0, 3).map((attribute) => (
              <span key={attribute.id} className="attribute-chip">
                {attribute.key}: {attribute.value}
              </span>
            ))}
          </div>
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
  );
}
