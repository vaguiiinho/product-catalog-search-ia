import { ProductSearchQuery } from "./product-search-query.value-object";

describe("ProductSearchQuery", () => {
  it.each([
    ["Tenis de valor 369,90", "Tenis", 369.9],
    ["Tênis por R$ 1.369,90", "Tênis", 1369.9],
    ["produto com preço 99.90", "produto", 99.9],
    ["R$ 49,99", "", 49.99],
    ["Garrafa térmica 332,99", "Garrafa térmica", 332.99],
    ["Mochila urbana 1.299,90", "Mochila urbana", 1299.9],
  ])("extracts a Brazilian monetary value from %s", (query, text, price) => {
    expect(ProductSearchQuery.create(query)).toMatchObject({ text, price });
  });

  it("does not interpret an isolated product number as price", () => {
    expect(ProductSearchQuery.create("tenis tamanho 42")).toMatchObject({
      text: "tenis tamanho 42",
      price: undefined,
    });
  });

  it("rejects an empty query and invalid monetary values", () => {
    expect(() => ProductSearchQuery.create(" ")).toThrow("obrigatorio");
    expect(() => ProductSearchQuery.create("produto por 100000000,00")).toThrow();
  });
});
