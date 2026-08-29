import { Inject, Injectable } from "@nestjs/common";
import { Category } from "../domain/category.entity";
import { CATEGORY_REPOSITORY, CategoryRepositoryPort } from "../domain/category.repository.port";

export type ListCategoriesOutput = Category[];

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  execute(): Promise<ListCategoriesOutput> {
    return this.categoryRepository.findAll();
  }
}
