import { validate } from "class-validator";
import { CreateProductDto } from "./dto/create-product.dto";

describe("CreateProductDto", () => {
  it("accepts valid input", async () => {
    const dto = Object.assign(new CreateProductDto(), {
      name: "Tenis leve",
      description: "Tenis para corrida urbana",
      price: 299.9,
    });

    await expect(validate(dto)).resolves.toEqual([]);
  });
});
