import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminIdentity = {
  email: string;
  name: string;
};

type JwtPayload = AdminIdentity & {
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  login(email: string, password: string) {
    const adminEmail = requiredEnv("ADMIN_EMAIL");
    const adminPassword = requiredEnv("ADMIN_PASSWORD");

    if (!safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase()) || !safeEqual(password, adminPassword)) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const admin: AdminIdentity = {
      email: adminEmail,
      name: process.env.ADMIN_NAME?.trim() || "Administrador",
    };

    return {
      accessToken: this.sign(admin),
      tokenType: "Bearer" as const,
      expiresIn: tokenTtlSeconds(),
      admin,
    };
  }

  verify(token: string): AdminIdentity {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !signature || token.split(".").length !== 3) {
      throw new UnauthorizedException("Token JWT inválido");
    }

    const expectedSignature = this.signature(`${encodedHeader}.${encodedPayload}`);
    if (!safeEqual(signature, expectedSignature)) {
      throw new UnauthorizedException("Token JWT inválido");
    }

    let header: unknown;
    let payload: JwtPayload;
    try {
      header = JSON.parse(fromBase64Url(encodedHeader));
      payload = JSON.parse(fromBase64Url(encodedPayload)) as JwtPayload;
    } catch {
      throw new UnauthorizedException("Token JWT inválido");
    }

    if (
      !isJwtHeader(header) ||
      !payload ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      throw new UnauthorizedException("Token JWT inválido ou expirado");
    }

    return { email: payload.email, name: payload.name };
  }

  private sign(admin: AdminIdentity) {
    const now = Math.floor(Date.now() / 1000);
    const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = toBase64Url(
      JSON.stringify({ ...admin, iat: now, exp: now + tokenTtlSeconds() } satisfies JwtPayload),
    );
    const unsignedToken = `${header}.${payload}`;

    return `${unsignedToken}.${this.signature(unsignedToken)}`;
  }

  private signature(value: string) {
    return createHmac("sha256", requiredEnv("JWT_SECRET")).update(value).digest("base64url");
  }
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} deve ser definido para autenticação de administrador.`);
  }
  return value;
}

function tokenTtlSeconds() {
  const configured = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 8);
  return Number.isInteger(configured) && configured > 0 ? configured : 60 * 60 * 8;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isJwtHeader(value: unknown): value is { alg: "HS256"; typ: "JWT" } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { alg?: unknown }).alg === "HS256" &&
    (value as { typ?: unknown }).typ === "JWT"
  );
}
