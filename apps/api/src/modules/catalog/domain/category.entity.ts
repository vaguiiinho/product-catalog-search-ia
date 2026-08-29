import { DomainError } from "./domain.error";
import { EntityId } from "./value-objects/entity-id.value-object";
import { RequiredText } from "./value-objects/required-text.value-object";
import { Slug } from "./value-objects/slug.value-object";

export type CategoryProps = {
  id?: string;
  name: string;
  slug: string;
  productCount?: number;
};

export class Category {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly productCount: number,
  ) {}

  static create(props: CategoryProps) {
    const productCount = props.productCount ?? 0;
    if (!Number.isInteger(productCount) || productCount < 0) {
      throw new DomainError("Quantidade de produtos da categoria deve ser um inteiro nao negativo.");
    }

    return new Category(
      EntityId.create(props.id, "ID da categoria").value,
      RequiredText.create(props.name, "Nome da categoria", 120).value,
      Slug.create(props.slug).value,
      productCount,
    );
  }
}
