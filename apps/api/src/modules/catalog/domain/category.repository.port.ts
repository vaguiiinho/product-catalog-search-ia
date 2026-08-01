import { Category } from "./category.entity";

export const CATEGORY_REPOSITORY = Symbol("CATEGORY_REPOSITORY");

export interface CategoryRepositoryPort {
  findAll(): Promise<Category[]>;
}
