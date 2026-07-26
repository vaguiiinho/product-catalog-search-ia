import { Global, Module } from "@nestjs/common";
import {
  AssistantRateLimitGuard,
  LoginRateLimitGuard,
  ProductsRateLimitGuard,
  RequestRateLimiter,
} from "./rate-limit.service";

@Global()
@Module({
  providers: [RequestRateLimiter, AssistantRateLimitGuard, LoginRateLimitGuard, ProductsRateLimitGuard],
  exports: [RequestRateLimiter, AssistantRateLimitGuard, LoginRateLimitGuard, ProductsRateLimitGuard],
})
export class RateLimitModule {}
