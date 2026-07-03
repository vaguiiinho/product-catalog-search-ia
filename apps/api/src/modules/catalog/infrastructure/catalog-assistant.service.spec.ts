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

  it("uses structured output when the model responds with json", async () => {
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

    const chatModel = {
      invoke: jest.fn().mockResolvedValue({
        content: JSON.stringify({
          answer: "O tenis leve e o melhor ajuste para corrida urbana.",
          summary: "Recomendacao baseada em leveza e uso para corrida.",
          highlights: ["leve", "corrida urbana"],
        }),
      }),
    };

    const service = new CatalogAssistantService(repository, chatModel);
    const result = await service.answerQuestion("tenis para corrida");

    expect(chatModel.invoke).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        expect.objectContaining({ role: "user" }),
      ]),
      expect.objectContaining({
        response_format: { type: "json_object" },
      }),
    );
    expect(result.usedFallback).toBe(false);
    expect(result.answer).toBe("O tenis leve e o melhor ajuste para corrida urbana.");
  });

  it("uses the catalog search tool when the model requests it", async () => {
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

    const chatModel = {
      bindTools: jest.fn().mockReturnThis(),
      invoke: jest
        .fn()
        .mockResolvedValueOnce({
          content: "tool call",
          tool_calls: [
            {
              id: "call_1",
              name: "search_catalog",
              args: {
                query: "tenis para corrida",
                limit: 1,
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          content: JSON.stringify({
            answer: "O tenis leve e o melhor ajuste para corrida urbana.",
            summary: "Recomendacao baseada na ferramenta do catalogo.",
            highlights: ["leve", "corrida urbana"],
          }),
        }),
    };

    const service = new CatalogAssistantService(repository, chatModel);
    const result = await service.answerQuestion("tenis para corrida");

    expect(chatModel.bindTools).toHaveBeenCalledTimes(1);
    expect(chatModel.invoke).toHaveBeenCalledTimes(2);
    expect(repository.search).toHaveBeenCalledWith("tenis para corrida");
    expect(result.usedFallback).toBe(false);
    expect(result.answer).toBe("O tenis leve e o melhor ajuste para corrida urbana.");
  });
});
