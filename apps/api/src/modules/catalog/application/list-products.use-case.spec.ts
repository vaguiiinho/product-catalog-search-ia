import { ListProductsUseCase } from "./list-products.use-case";

describe("ListProductsUseCase", () => {
  it("returns an empty list for the scaffolded implementation", () => {
    const useCase = new ListProductsUseCase();

    expect(useCase.execute()).toEqual([]);
  });
});
