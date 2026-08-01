import { Controller, Get } from "@nestjs/common";
import { ListCategoriesUseCase } from "../application/list-categories.use-case";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  @Get()
  list() {
    return this.listCategoriesUseCase.execute();
  }
}
