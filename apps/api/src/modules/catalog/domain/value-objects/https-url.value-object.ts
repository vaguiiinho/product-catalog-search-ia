import { DomainError } from "../domain.error";

export class HttpsUrl {
  private constructor(public readonly value: string) {}

  static create(value: string, field = "URL") {
    const normalized = value.trim();

    try {
      const url = new URL(normalized);
      if (url.protocol !== "https:") throw new Error();
    } catch {
      throw new DomainError(`${field} deve ser uma URL HTTPS valida.`);
    }

    return new HttpsUrl(normalized);
  }
}
