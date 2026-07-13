import { Module } from "@nestjs/common";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [HealthModule, AuthModule, CatalogModule],
})
export class AppModule {}
