import { GetProductUseCase } from "./get-product.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("GetProductUseCase", () => {
  it("returns a product by id", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        id: "prod_1",
        name: "Tenis leve",
        description: "Tenis para corrida urbana",
        price: 299.9,
        category: {
          id: "cat_1",
          name: "Calçados",
          slug: "calcados",
        },
        attributes: [],
        images: [],
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      }),
      create: jest.fn(),
    };

    const useCase = new GetProductUseCase(repository);

    await expect(useCase.execute("prod_1")).resolves.toMatchObject({ id: "prod_1" });
    expect(repository.findById).toHaveBeenCalledWith("prod_1");
  });
});
