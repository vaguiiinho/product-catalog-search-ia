import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

type Limit = {
  maxRequests: number;
  windowMs: number;
  message: string;
};

@Injectable()
export class RequestRateLimiter {
  private readonly requestsByKey = new Map<string, number[]>();

  consume(key: string, limit: Limit) {
    const now = Date.now();
    const threshold = now - limit.windowMs;
    const recentRequests = (this.requestsByKey.get(key) ?? []).filter((timestamp) => timestamp > threshold);

    if (recentRequests.length >= limit.maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((recentRequests[0] + limit.windowMs - now) / 1000));
      this.requestsByKey.set(key, recentRequests);
      return { allowed: false, retryAfterSeconds };
    }

    recentRequests.push(now);
    this.requestsByKey.set(key, recentRequests);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

abstract class RateLimitGuard implements CanActivate {
  protected abstract readonly limit: Limit;

  constructor(private readonly rateLimiter: RequestRateLimiter) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      ip?: string;
    }>();
    const response = context.switchToHttp().getResponse<{ setHeader(name: string, value: string): void }>();
    const result = this.rateLimiter.consume(`${this.constructor.name}:${getClientIp(request)}`, this.limit);

    if (result.allowed) {
      return true;
    }

    response.setHeader("Retry-After", String(result.retryAfterSeconds));
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `${this.limit.message} Tente novamente em cerca de ${result.retryAfterSeconds} segundos.`,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

@Injectable()
export class AssistantRateLimitGuard extends RateLimitGuard {
  protected readonly limit = { maxRequests: 5, windowMs: 60_000, message: "Muitas perguntas em pouco tempo." };

  constructor(rateLimiter: RequestRateLimiter) {
    super(rateLimiter);
  }
}

@Injectable()
export class LoginRateLimitGuard extends RateLimitGuard {
  protected readonly limit = { maxRequests: 5, windowMs: 60_000, message: "Muitas tentativas de acesso." };

  constructor(rateLimiter: RequestRateLimiter) {
    super(rateLimiter);
  }
}

@Injectable()
export class ProductsRateLimitGuard extends RateLimitGuard {
  protected readonly limit = { maxRequests: 20, windowMs: 60_000, message: "Muitas solicitações ao catálogo." };

  constructor(rateLimiter: RequestRateLimiter) {
    super(rateLimiter);
  }
}

function getClientIp(request: { headers: Record<string, string | string[] | undefined>; ip?: string }) {
  const forwarded = request.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const clientIp = forwardedValue?.split(",")[0]?.trim() || request.headers["x-real-ip"] || request.ip;
  return typeof clientIp === "string" && clientIp ? clientIp : "unknown";
}
