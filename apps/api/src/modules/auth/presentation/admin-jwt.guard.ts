import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService, AdminIdentity } from "../auth.service";

type RequestWithAdmin = {
  headers?: { authorization?: string | string[] };
  admin?: AdminIdentity;
};

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const authorization = request.headers?.authorization;
    const token = typeof authorization === "string" ? authorization.match(/^Bearer\s+(.+)$/i)?.[1] : undefined;

    if (!token) {
      throw new UnauthorizedException("Informe um token Bearer de administrador.");
    }

    request.admin = this.authService.verify(token);
    return true;
  }
}
