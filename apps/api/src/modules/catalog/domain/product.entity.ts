export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
