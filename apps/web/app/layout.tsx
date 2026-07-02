import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalogo com Busca Semantica",
  description: "Projeto de portfolio com Next.js, NestJS e busca semantica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
