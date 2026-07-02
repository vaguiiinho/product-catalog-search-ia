export class ProductCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
  ) {}
}

export class ProductAttribute {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly value: string,
  ) {}
}

export class ProductImage {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly alt: string,
    public readonly position: number,
  ) {}
}

export class Product {
  constructor(
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
}
