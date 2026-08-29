import { DomainError } from "../domain.error";

export class ProductPrice {
  private constructor(public readonly value: number) {}

  static create(value: number) {
    if (!Number.isFinite(value) || value < 0 || value > 99_999_999.99) {
      throw new DomainError("Preco do produto deve ser um valor valido e nao negativo.");
    }

    const cents = value * 100;
    if (Math.abs(Math.round(cents) - cents) > 1e-8) {
      throw new DomainError("Preco do produto deve ter no maximo duas casas decimais.");
    }

    return new ProductPrice(value);
  }
}
