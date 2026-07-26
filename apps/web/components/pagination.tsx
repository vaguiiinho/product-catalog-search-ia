import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginação do catálogo">
      {page > 1 ? <Link href={hrefForPage(page - 1)}>Anterior</Link> : <span>Anterior</span>}
      <span aria-current="page">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? <Link href={hrefForPage(page + 1)}>Próxima</Link> : <span>Próxima</span>}
    </nav>
  );
}
