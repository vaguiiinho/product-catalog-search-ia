import {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductDetails,
  ProductImage,
} from "./product.entity";

const CATEGORY_ID = "84e3b94c-b726-4f70-9a17-a3850b48aaf7";

describe("Product domain", () => {
  it("creates a valid aggregate with unique UUIDs", () => {
    const category = ProductCategory.create({ id: CATEGORY_ID, name: "Esporte", slug: "esporte" });
    const product = Product.create({
      name: " Tênis leve ",
      description: " Para corrida urbana ",
      price: 299.9,
      category,
      attributes: [ProductAttribute.create({ key: "Cor", value: "Azul" })],
      images: [ProductImage.create({ url: "https://cdn.example.com/tenis.jpg", alt: "Tênis azul" })],
    });

    expect(product.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(product.name).toBe("Tênis leve");
    expect(product.attributes[0].id).not.toBe(product.id);
    expect(product.images[0].id).not.toBe(product.id);
  });

  it.each([NaN, -1, 12.345, 100_000_000])("rejects invalid price %s", (price) => {
    expect(() => ProductDetails.create({ name: "Produto", description: "Descrição", price })).toThrow();
  });

  it("rejects an invalid product UUID", () => {
    const category = ProductCategory.create({ name: "Esporte", slug: "esporte" });
    expect(() =>
      Product.create({ id: "prod_1", name: "Produto", description: "Descrição", price: 10, category }),
    ).toThrow("UUID");
  });

  it("accepts only HTTPS image URLs and non-negative integer positions", () => {
    expect(() => ProductImage.create({ url: "http://example.com/a.jpg", alt: "Imagem" })).toThrow("HTTPS");
    expect(() =>
      ProductImage.create({ url: "https://example.com/a.jpg", alt: "Imagem", position: -1 }),
    ).toThrow("inteiro");
  });
});
