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
      search: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new ListProductsUseCase(repository);

    await expect(useCase.execute()).resolves.toMatchObject({
      items: [expect.objectContaining({ id: "prod_1" })],
      meta: { page: 1, limit: 9, total: 1, totalPages: 1 },
    });
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("uses hybrid search when query is provided", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new ListProductsUseCase(repository);

    await expect(useCase.execute("tenis")).resolves.toEqual({
      items: [],
      meta: { page: 1, limit: 9, total: 0, totalPages: 1 },
    });
    expect(repository.search).toHaveBeenCalledWith("tenis");
  });
});
