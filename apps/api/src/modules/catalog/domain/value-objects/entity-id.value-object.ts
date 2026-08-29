import { randomUUID } from "node:crypto";
import { DomainError } from "../domain.error";

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EntityId {
  private constructor(public readonly value: string) {}

  static create(value: string = randomUUID(), field = "Identificador") {
    const normalized = value.trim();

    if (!UUID_V4_PATTERN.test(normalized)) {
      throw new DomainError(`${field} deve ser um UUID v4 valido.`);
    }

    return new EntityId(normalized.toLowerCase());
  }
}
