import { ListProductsUseCase } from "./list-products.use-case";

describe("ListProductsUseCase", () => {
  it("returns an empty list for the scaffolded implementation", async () => {
    const useCase = new ListProductsUseCase();

    await expect(useCase.execute()).resolves.toEqual([]);
  });
});
