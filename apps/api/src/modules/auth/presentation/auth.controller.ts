import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService, AdminIdentity } from "../auth.service";
import { AdminJwtGuard } from "./admin-jwt.guard";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get("me")
  @UseGuards(AdminJwtGuard)
  me(@Req() request: { admin: AdminIdentity }) {
    return request.admin;
  }
}
