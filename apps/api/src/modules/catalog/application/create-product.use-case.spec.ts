import { CreateProductUseCase } from "./create-product.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("CreateProductUseCase", () => {
  it("delegates creation to the repository", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue({
        id: "prod_1",
        name: "Tenis leve",
        description: "Tenis para corrida urbana",
        price: 299.9,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      }),
    };

    const useCase = new CreateProductUseCase(repository);
    const result = await useCase.execute({
      name: "Tenis leve",
      description: "Tenis para corrida urbana",
      price: 299.9,
    });

    expect(repository.create).toHaveBeenCalledWith({
      name: "Tenis leve",
      description: "Tenis para corrida urbana",
      price: 299.9,
    });
    expect(result.id).toBe("prod_1");
  });
});
