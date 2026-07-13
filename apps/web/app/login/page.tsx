import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesso ao painel administrativo do catalogo.",
};

const authCookieName = "admin_access_token";

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "/admin");
  return path.startsWith("/") && !path.startsWith("//") ? path : "/admin";
}

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeRedirectPath(formData.get("next"));

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Informe e-mail e senha.")}&next=${encodeURIComponent(nextPath)}`);
  }

  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    redirect(`/login?error=${encodeURIComponent("Nao foi possivel conectar a API.")}&next=${encodeURIComponent(nextPath)}`);
  }

  if (!response.ok) {
    redirect(`/login?error=${encodeURIComponent("E-mail ou senha invalidos.")}&next=${encodeURIComponent(nextPath)}`);
  }

  const payload = (await response.json()) as {
    accessToken?: string;
    token?: string;
    expiresIn?: number;
  };
  const accessToken = payload.accessToken ?? payload.token;

  if (!accessToken) {
    redirect(`/login?error=${encodeURIComponent("A API nao retornou um token de acesso valido.")}&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  const maxAge = Number.isInteger(payload.expiresIn) && (payload.expiresIn ?? 0) > 0
    ? payload.expiresIn!
    : 60 * 60 * 8;
  cookieStore.set(authCookieName, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  redirect(nextPath);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const nextPath = getSafeRedirectPath(next ?? "/admin");

  return (
    <main className="page-shell auth-page">
      <section className="hero auth-hero">
        <p className="eyebrow">Area restrita</p>
        <h1>Entre para acessar o painel administrativo.</h1>
        <p className="lead">Use as credenciais de administrador configuradas no ambiente da API.</p>
        {error ? <p className="error-banner" role="alert">{error}</p> : null}
        <form className="admin-form login-form" action={login}>
          <input type="hidden" name="next" value={nextPath} />
          <label className="admin-field">
            <span>E-mail</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="admin-field">
            <span>Senha</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Entrar no admin</button>
        </form>
        <Link href="/" className="back-link auth-back-link">Voltar ao inicio</Link>
      </section>
    </main>
  );
}
