import { GetProductUseCase } from "./get-product.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("GetProductUseCase", () => {
  const productId = "f5b32818-fd68-4c25-a4af-b7384ea1bd08";
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
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new GetProductUseCase(repository);

    await expect(useCase.execute(productId)).resolves.toMatchObject({ id: "prod_1" });
    expect(repository.findById).toHaveBeenCalledWith(productId);
  });

  it("rejects an invalid id before querying the repository", async () => {
    const repository = { findById: jest.fn() } as unknown as ProductRepositoryPort;
    const useCase = new GetProductUseCase(repository);

    expect(() => useCase.execute("prod_1")).toThrow("UUID");
    expect(repository.findById).not.toHaveBeenCalled();
  });
});
