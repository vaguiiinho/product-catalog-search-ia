import { ListProductsUseCase } from "./list-products.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("ListProductsUseCase", () => {
  it("returns products from the repository", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn().mockResolvedValue([
        {
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
        },
      ]),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const useCase = new ListProductsUseCase(repository);

    await expect(useCase.execute()).resolves.toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalledWith(undefined);
  });
});
