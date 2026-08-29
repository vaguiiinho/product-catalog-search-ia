import { Category } from "./category.entity";

describe("Category", () => {
  it("creates a valid category with a generated UUID", () => {
    const category = Category.create({ name: "  Calçados  ", slug: "Calcados" });

    expect(category.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(category).toMatchObject({ name: "Calçados", slug: "calcados", productCount: 0 });
  });

  it.each([
    [{ id: "cat_1", name: "Calçados", slug: "calcados" }, "UUID"],
    [{ name: "", slug: "calcados" }, "obrigatorio"],
    [{ name: "Calçados", slug: "inválido!" }, "Slug"],
    [{ name: "Calçados", slug: "calcados", productCount: -1 }, "inteiro"],
  ])("rejects an invalid category", (props, message) => {
    expect(() => Category.create(props)).toThrow(message);
  });

  it("uses a supplied UUID v4", () => {
    const id = "7aa3570a-f856-4e51-b578-62450d82b66f";
    expect(Category.create({ id, name: "Esporte", slug: "esporte" }).id).toBe(id);
  });
});
