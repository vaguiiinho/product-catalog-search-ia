import { CatalogAgentService } from "./catalog-assistant.service";
import { ProductRepositoryPort } from "../domain/product.repository.port";
import { Logger } from "@nestjs/common";

describe("CatalogAgentService", () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
      update: jest.fn(),
      delete: jest.fn(),
    };

    const service = new CatalogAgentService(repository, null);
    const result = await service.answerQuestion("tenis para corrida");

    expect(result.usedFallback).toBe(true);
    expect(result.sources).toHaveLength(1);
    expect(result.answer).toContain("A resposta foi gerada localmente");
    expect(result.notice).toContain("GROQ_API_KEY");
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
      update: jest.fn(),
      delete: jest.fn(),
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

    const service = new CatalogAgentService(repository, chatModel);
    const result = await service.answerQuestion("tenis para corrida");

    expect(chatModel.invoke).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        expect.objectContaining({ role: "user" }),
      ]),
    );
    expect(result.usedFallback).toBe(false);
    expect(result.answer).toBe("O tenis leve e o melhor ajuste para corrida urbana.");
  });

  it.each([
    ['```json\n{"answer":"Produto encontrado por preço.","summary":"ok","highlights":[]}\n```'],
    [[{ type: "text", text: '{"answer":"Produto encontrado por preço."}' }]],
    ["Produto encontrado por preço."],
  ])("accepts JSON fences, LangChain blocks and plain text responses", async (content) => {
    const repository = createEmptyRepository();
    const chatModel = { invoke: jest.fn().mockResolvedValue({ content }) };
    const service = new CatalogAgentService(repository, chatModel);

    const result = await service.answerQuestion("produto por 369,90");

    expect(result).toMatchObject({
      answer: "Produto encontrado por preço.",
      usedFallback: false,
    });
    expect(repository.search).toHaveBeenCalledWith("produto", { price: 369.9 });
  });

  it("returns a retry notice and local fallback when Groq is rate limited", async () => {
    const repository: ProductRepositoryPort = {
      findAll: jest.fn(),
      search: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const chatModel = {
      invoke: jest.fn().mockRejectedValue({
        status: 429,
        headers: { "retry-after": "30" },
      }),
    };

    const service = new CatalogAgentService(repository, chatModel);
    const result = await service.answerQuestion("tenis para corrida");

    expect(result.usedFallback).toBe(true);
    expect(result.notice).toContain("30 segundos");
  });

  it.each([
    [401, "chave da Groq foi recusada"],
    [403, "não possui acesso ao modelo"],
    [400, "recusou a solicitação"],
    [503, "temporariamente indisponível"],
  ])("explains Groq HTTP %s fallback without exposing error details", async (status, expectedNotice) => {
    const repository = createEmptyRepository();
    const chatModel = {
      invoke: jest.fn().mockRejectedValue({ status, message: "sensitive upstream detail" }),
    };
    const service = new CatalogAgentService(repository, chatModel);

    const result = await service.answerQuestion("tenis para corrida");

    expect(result.usedFallback).toBe(true);
    expect(result.notice).toContain(expectedNotice);
    expect(result.notice).not.toContain("sensitive upstream detail");
    expect(Logger.prototype.warn).toHaveBeenCalledWith(
      expect.stringContaining(`status=${status}`),
    );
  });

  it("uses a generic notice for network failures", async () => {
    const repository = createEmptyRepository();
    const chatModel = {
      invoke: jest.fn().mockRejectedValue(new Error("ECONNRESET")),
    };
    const service = new CatalogAgentService(repository, chatModel);

    const result = await service.answerQuestion("tenis para corrida");

    expect(result.notice).toContain("comunicar com a Groq");
    expect(result.notice).not.toContain("ECONNRESET");
  });

  it("uses the products already retrieved as context without a second search", async () => {
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
      update: jest.fn(),
      delete: jest.fn(),
    };

    const chatModel = {
      invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            answer: "O tenis leve e o melhor ajuste para corrida urbana.",
            summary: "Recomendacao baseada na ferramenta do catalogo.",
            highlights: ["leve", "corrida urbana"],
          }),
        }),
    };

    const service = new CatalogAgentService(repository, chatModel);
    const result = await service.answerQuestion("tenis para corrida");

    expect(chatModel.invoke).toHaveBeenCalledTimes(1);
    expect(repository.search).toHaveBeenCalledWith("tenis para corrida");
    expect(chatModel.invoke.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.stringContaining("Tenis leve"),
        }),
      ]),
    );
    expect(result.usedFallback).toBe(false);
    expect(result.answer).toBe("O tenis leve e o melhor ajuste para corrida urbana.");
  });
});

function createEmptyRepository(): ProductRepositoryPort {
  return {
    findAll: jest.fn(),
    search: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}
