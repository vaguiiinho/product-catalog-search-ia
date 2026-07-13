import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Catalogo com Busca Semantica",
    template: "%s | Catalogo com Busca Semantica",
  },
  description:
    "Projeto de portfolio com Next.js, NestJS, pgvector e um assistente RAG em runtime sobre um sistema existente.",
  openGraph: {
    title: "Catalogo com Busca Semantica",
    description:
      "Projeto de portfolio com Next.js, NestJS, pgvector e um assistente RAG em runtime sobre um sistema existente.",
    url: siteUrl,
    siteName: "Catalogo com Busca Semantica",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const theme = localStorage.getItem("catalog-theme"); document.documentElement.dataset.theme = theme === "light" || theme === "dark" ? theme : "dark"; } catch { document.documentElement.dataset.theme = "dark"; } })();`,
          }}
        />
        <header className="site-header">
          <nav className="site-nav" aria-label="Navegacao principal">
            <Link className="brand-link" href="/">
              Catalogo IA
            </Link>
            <div className="site-nav-actions">
              <Link href="/admin">Admin</Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
