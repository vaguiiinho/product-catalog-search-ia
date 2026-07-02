import { SearchProductsUseCase } from "./search-products.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("SearchProductsUseCase", () => {
  it("delegates hybrid search to the repository", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const useCase = new SearchProductsUseCase(repository);

    await expect(useCase.execute("tenis")).resolves.toEqual([]);
    expect(repository.search).toHaveBeenCalledWith("tenis");
  });
});
