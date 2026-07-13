import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./presentation/auth.controller";
import { AdminJwtGuard } from "./presentation/admin-jwt.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminJwtGuard],
  // O guard e resolvido no contexto dos modulos que o utilizam; por isso
  // sua dependencia tambem precisa ser exportada.
  exports: [AuthService, AdminJwtGuard],
})
export class AuthModule {}
