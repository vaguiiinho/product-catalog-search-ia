import { Inject, Injectable } from "@nestjs/common";
import { Category } from "../domain/category.entity";
import { CATEGORY_REPOSITORY, CategoryRepositoryPort } from "../domain/category.repository.port";

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
