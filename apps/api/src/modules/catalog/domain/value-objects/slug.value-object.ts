import { DomainError } from "../domain.error";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class Slug {
  private constructor(public readonly value: string) {}

  static create(value: string) {
    const normalized = value.trim().toLowerCase();

    if (!SLUG_PATTERN.test(normalized)) {
      throw new DomainError("Slug deve conter apenas letras minusculas, numeros e hifens.");
    }

    return new Slug(normalized);
  }
}
