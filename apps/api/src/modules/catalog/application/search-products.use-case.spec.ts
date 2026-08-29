import { SearchProductsUseCase } from "./search-products.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("SearchProductsUseCase", () => {
  it("delegates hybrid search to the repository", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new SearchProductsUseCase(repository);

    await expect(useCase.execute("tenis")).resolves.toEqual([]);
    expect(repository.search).toHaveBeenCalledWith("tenis");
  });

  it("rejects an empty query before calling the repository", async () => {
    const repository = { search: jest.fn() } as unknown as ProductRepositoryPort;
    const useCase = new SearchProductsUseCase(repository);

    expect(() => useCase.execute("   ")).toThrow("obrigatorio");
    expect(repository.search).not.toHaveBeenCalled();
  });

  it("extracts a price and sends a structured filter to the repository", async () => {
    const repository = {
      search: jest.fn().mockResolvedValue([]),
    } as unknown as ProductRepositoryPort;
    const useCase = new SearchProductsUseCase(repository);

    await useCase.execute("Tenis de valor 369,90");

    expect(repository.search).toHaveBeenCalledWith("Tenis", { price: 369.9 });
  });

  it("recognizes a trailing Brazilian decimal as price without requiring a keyword", async () => {
    const repository = {
      search: jest.fn().mockResolvedValue([]),
    } as unknown as ProductRepositoryPort;
    const useCase = new SearchProductsUseCase(repository);

    await useCase.execute("Garrafa térmica 332,99");

    expect(repository.search).toHaveBeenCalledWith("Garrafa térmica", { price: 332.99 });
  });
});
