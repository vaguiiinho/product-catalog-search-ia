import { DomainError } from "../domain.error";

export class RequiredText {
  private constructor(public readonly value: string) {}

  static create(value: string, field: string, maxLength: number) {
    const normalized = value.trim();

    if (!normalized) {
      throw new DomainError(`${field} e obrigatorio.`);
    }

    if (normalized.length > maxLength) {
      throw new DomainError(`${field} deve ter no maximo ${maxLength} caracteres.`);
    }

    return new RequiredText(normalized);
  }
}
