import { DeleteProductUseCase } from "./delete-product.use-case";
import { UpdateProductUseCase } from "./update-product.use-case";
import { ProductRepositoryPort } from "../domain/product.repository.port";

const PRODUCT_ID = "83dff0f4-2465-4479-862f-30b9077b3525";

describe("Catalog write use cases", () => {
  it("validates and updates a product", async () => {
    const repository = {
      update: jest.fn().mockResolvedValue({ id: PRODUCT_ID }),
    } as unknown as ProductRepositoryPort;
    const useCase = new UpdateProductUseCase(repository);

    await expect(
      useCase.execute(PRODUCT_ID, {
        name: "  Mochila urbana ",
        description: " Resistente à água ",
        price: 199.9,
        categoryName: " Acessórios ",
      }),
    ).resolves.toMatchObject({ id: PRODUCT_ID });
    expect(repository.update).toHaveBeenCalledWith(
      PRODUCT_ID,
      expect.objectContaining({
        name: "Mochila urbana",
        description: "Resistente à água",
        categoryName: "Acessórios",
      }),
    );
  });

  it("does not update when product data is invalid", async () => {
    const repository = { update: jest.fn() } as unknown as ProductRepositoryPort;
    const useCase = new UpdateProductUseCase(repository);

    expect(() =>
      useCase.execute(PRODUCT_ID, { name: "", description: "Descrição", price: 10 }),
    ).toThrow("obrigatorio");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deletes only after validating the UUID", async () => {
    const repository = { delete: jest.fn().mockResolvedValue(true) } as unknown as ProductRepositoryPort;
    const useCase = new DeleteProductUseCase(repository);

    await expect(useCase.execute(PRODUCT_ID)).resolves.toBe(true);
    expect(() => useCase.execute("product_1")).toThrow("UUID");
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });
});
