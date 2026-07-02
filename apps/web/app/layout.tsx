import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Catalogo com Busca Semantica",
    template: "%s | Catalogo com Busca Semantica",
  },
  description: "Projeto de portfolio com Next.js, NestJS e busca semantica.",
  openGraph: {
    title: "Catalogo com Busca Semantica",
    description: "Projeto de portfolio com Next.js, NestJS e busca semantica.",
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
