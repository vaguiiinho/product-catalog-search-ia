import { Module } from "@nestjs/common";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RateLimitModule } from "./shared/rate-limit/rate-limit.module";

@Module({
  imports: [RateLimitModule, HealthModule, AuthModule, CatalogModule],
})
export class AppModule {}
