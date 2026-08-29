import { AskCatalogAgentUseCase } from "./ask-catalog-assistant.use-case";
import { ListCategoriesUseCase } from "./list-categories.use-case";
import { UpsertSemanticIndexUseCase } from "./upsert-semantic-index.use-case";
import { CategoryRepositoryPort } from "../domain/category.repository.port";
import { CatalogAssistantPort } from "./ports/catalog-assistant.port";
import { SemanticIndexPort } from "./ports/semantic-index.port";

describe("Catalog support use cases", () => {
  it("returns categories from its repository", async () => {
    const categories = [{ id: "1", name: "Esporte", slug: "esporte", productCount: 2 }];
    const repository = { findAll: jest.fn().mockResolvedValue(categories) } as CategoryRepositoryPort;

    await expect(new ListCategoriesUseCase(repository).execute()).resolves.toBe(categories);
  });

  it("normalizes and delegates a valid assistant question", async () => {
    const service = {
      answerQuestion: jest.fn().mockResolvedValue({ answer: "Resposta" }),
    } as CatalogAssistantPort;
    const useCase = new AskCatalogAgentUseCase(service);

    await expect(useCase.execute("  tênis para corrida  ")).resolves.toMatchObject({ answer: "Resposta" });
    expect(service.answerQuestion).toHaveBeenCalledWith("tênis para corrida");
    expect(() => useCase.execute("a")).toThrow("tres caracteres");
  });

  it("returns the semantic indexing output", async () => {
    const service = {
      upsertDocuments: jest.fn().mockResolvedValue({ storedCount: 1 }),
    } as SemanticIndexPort;
    const useCase = new UpsertSemanticIndexUseCase(service);
    const input = {
      documents: [{
        id: "doc_1",
        productId: "product_1",
        title: "Tênis",
        semanticText: "Tênis leve para corrida",
        facets: { uso: ["corrida"] },
        embedding: Array(8).fill(0.1),
      }],
    };

    await expect(useCase.execute(input)).resolves.toEqual({ storedCount: 1 });
    expect(service.upsertDocuments).toHaveBeenCalledWith(input.documents);
  });
});
