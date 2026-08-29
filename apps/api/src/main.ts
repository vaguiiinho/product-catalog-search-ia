import { loadApiEnv } from "./bootstrap-env";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DomainErrorFilter } from "./modules/catalog/presentation/domain-error.filter";

async function bootstrap() {
  loadApiEnv();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  const corsOrigin = process.env.CORS_ORIGIN?.trim();

  if (corsOrigin) {
    app.enableCors({ origin: corsOrigin });
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}

void bootstrap();
