import { DomainError } from "./domain.error";
import { EntityId } from "./value-objects/entity-id.value-object";
import { HttpsUrl } from "./value-objects/https-url.value-object";
import { ProductPrice } from "./value-objects/product-price.value-object";
import { RequiredText } from "./value-objects/required-text.value-object";
import { Slug } from "./value-objects/slug.value-object";

export type ProductDetailsProps = {
  name: string;
  description: string;
  price: number;
  categoryName?: string;
};

export class ProductDetails {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryName: string,
  ) {}

  static create(props: ProductDetailsProps) {
    return new ProductDetails(
      RequiredText.create(props.name, "Nome do produto", 160).value,
      RequiredText.create(props.description, "Descricao do produto", 2_000).value,
      ProductPrice.create(props.price).value,
      RequiredText.create(props.categoryName ?? "Geral", "Nome da categoria", 120).value,
    );
  }
}

export class ProductCategory {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
  ) {}

  static create(props: { id?: string; name: string; slug: string }) {
    return new ProductCategory(
      EntityId.create(props.id, "ID da categoria do produto").value,
      RequiredText.create(props.name, "Nome da categoria", 120).value,
      Slug.create(props.slug).value,
    );
  }
}

export class ProductAttribute {
  private constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly value: string,
  ) {}

  static create(props: { id?: string; key: string; value: string }) {
    return new ProductAttribute(
      EntityId.create(props.id, "ID do atributo").value,
      RequiredText.create(props.key, "Chave do atributo", 100).value,
      RequiredText.create(props.value, "Valor do atributo", 500).value,
    );
  }
}

export class ProductImage {
  private constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly alt: string,
    public readonly position: number,
  ) {}

  static create(props: { id?: string; url: string; alt: string; position?: number }) {
    const position = props.position ?? 0;
    if (!Number.isInteger(position) || position < 0) {
      throw new DomainError("Posicao da imagem deve ser um inteiro nao negativo.");
    }

    return new ProductImage(
      EntityId.create(props.id, "ID da imagem").value,
      HttpsUrl.create(props.url, "Imagem do produto").value,
      RequiredText.create(props.alt, "Texto alternativo da imagem", 300).value,
      position,
    );
  }
}

export type ProductProps = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public readonly category: ProductCategory,
    public readonly attributes: ProductAttribute[],
    public readonly images: ProductImage[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: ProductProps) {
    const details = ProductDetails.create(props);
    const createdAt = props.createdAt ?? new Date();
    const updatedAt = props.updatedAt ?? createdAt;

    if (Number.isNaN(createdAt.getTime()) || Number.isNaN(updatedAt.getTime())) {
      throw new DomainError("Datas do produto devem ser validas.");
    }

    return new Product(
      EntityId.create(props.id, "ID do produto").value,
      details.name,
      details.description,
      details.price,
      props.category,
      props.attributes ?? [],
      props.images ?? [],
      createdAt,
      updatedAt,
    );
  }
}
