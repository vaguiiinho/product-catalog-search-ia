import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  const environment = process.env;

  beforeEach(() => {
    process.env = {
      ...environment,
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "senha-segura",
      ADMIN_NAME: "Admin",
      JWT_SECRET: "segredo-de-teste-com-tamanho-suficiente",
      JWT_EXPIRES_IN_SECONDS: "3600",
    };
  });

  afterAll(() => {
    process.env = environment;
  });

  it("emite e valida um JWT para as credenciais administrativas", () => {
    const service = new AuthService();
    const result = service.login("admin@example.com", "senha-segura");

    expect(result.accessToken.split(".")).toHaveLength(3);
    expect(service.verify(result.accessToken)).toEqual({
      email: "admin@example.com",
      name: "Admin",
    });
  });

  it("rejeita credenciais incorretas", () => {
    const service = new AuthService();

    expect(() => service.login("admin@example.com", "incorreta")).toThrow(UnauthorizedException);
  });
});
