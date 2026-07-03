import { CatalogAssistantService } from "./catalog-assistant.service";
import { ProductRepositoryPort } from "../domain/product.repository.port";

describe("CatalogAssistantService", () => {
  it("falls back when the model is unavailable", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn().mockResolvedValue([
        {
          id: "prod_1",
          name: "Tenis leve",
          description: "Tenis para corrida urbana",
          price: 299.9,
          category: {
            id: "cat_1",
            name: "Calcados",
            slug: "calcados",
          },
          attributes: [],
          images: [],
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ]),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const service = new CatalogAssistantService(repository, null);
    const result = await service.answerQuestion("tenis para corrida");

    expect(result.usedFallback).toBe(true);
    expect(result.sources).toHaveLength(1);
    expect(result.answer).toContain("A camada de RAG ainda esta usando fallback local");
  });
});
