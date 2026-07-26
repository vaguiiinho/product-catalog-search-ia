import { Inject, Injectable, Optional } from "@nestjs/common";
import { ToolMessage } from "@langchain/core/messages/tool";
import { tool } from "@langchain/core/tools";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { GROQ_CHAT_MODEL, GROQ_MODEL, ChatModelLike } from "./groq-chat-model.provider";

export type CatalogAssistantSource = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export type CatalogAssistantResponse = {
  question: string;
  answer: string;
  model: string;
  retrievedCount: number;
  usedFallback: boolean;
  sources: CatalogAssistantSource[];
};

type CatalogAssistantPayload = {
  answer: string;
  summary?: string;
  highlights?: string[];
};

@Injectable()
export class CatalogAgentService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Optional()
    @Inject(GROQ_CHAT_MODEL)
    private readonly chatModel: ChatModelLike | null,
  ) {}

  async answerQuestion(question: string): Promise<CatalogAssistantResponse> {
    const normalizedQuestion = question.trim();
    const products = await this.productRepository.search(normalizedQuestion);
    const contextProducts = products.slice(0, 5);
    const context = buildContext(normalizedQuestion, contextProducts);
    const model = GROQ_MODEL;
    const searchTool = createCatalogSearchTool(this.productRepository);

    if (!this.chatModel) {
      return {
        question: normalizedQuestion,
        answer: fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: true,
        sources: contextProducts.map(mapSource),
      };
    }

    try {
      const modelWithTools = this.chatModel.bindTools?.([searchTool], {
        tool_choice: "auto",
      }) ?? this.chatModel;

      const firstResponse = await modelWithTools.invoke(
        [
          {
            role: "system",
            content:
              "Voce e um assistente de catalogo. Responda em portugues. Use a ferramenta search_catalog quando precisar recuperar produtos. Retorne um JSON valido com as chaves answer, summary e highlights. Se faltar informacao, diga isso de forma objetiva e nao invente produtos.",
          },
          {
            role: "user",
            content: context,
          },
        ],
      );

      const toolCalls = firstResponse.tool_calls ?? [];

      if (toolCalls.length > 0) {
        const toolMessages = [];

        for (const call of toolCalls) {
          if (call.name !== "search_catalog") {
            continue;
          }

          const toolResult = await (searchTool as unknown as {
            invoke(input: { query: string; limit?: number }): Promise<{ content: unknown }>;
          }).invoke({
            query: String(call.args.query ?? "").trim(),
            limit: typeof call.args.limit === "number" ? call.args.limit : undefined,
          });
          toolMessages.push(
            new ToolMessage({
              content: String(toolResult.content ?? ""),
              tool_call_id: call.id ?? "search_catalog_call",
              status: "success",
            }),
          );
        }

        if (toolMessages.length > 0) {
          const finalResponse = await modelWithTools.invoke(
            [
              {
                role: "system",
                content:
                  "Responda em portugues e retorne um JSON valido com answer, summary e highlights. Use somente o contexto e o resultado da ferramenta.",
              },
              {
                role: "user",
                content: context,
              },
              firstResponse,
              ...toolMessages,
            ],
          );

          const payload = parseAssistantPayload(finalResponse.content);

          return {
            question: normalizedQuestion,
            answer: payload?.answer?.trim() || fallbackAnswer(contextProducts, normalizedQuestion),
            model,
            retrievedCount: contextProducts.length,
            usedFallback: false,
            sources: contextProducts.map(mapSource),
          };
        }
      }

      const payload = parseAssistantPayload(firstResponse.content);

      return {
        question: normalizedQuestion,
        answer: payload?.answer?.trim() || fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: false,
        sources: contextProducts.map(mapSource),
      };
    } catch {
      return {
        question: normalizedQuestion,
        answer: fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: true,
        sources: contextProducts.map(mapSource),
      };
    }
  }
}

function buildContext(question: string, products: Array<{ id: string; name: string; description: string; price: number; category: { name: string }; attributes: Array<{ key: string; value: string }> }>) {
  if (products.length === 0) {
    return [
      `Pergunta: ${question}`,
      "Contexto do catalogo: nenhum produto relevante foi encontrado na busca estruturada.",
      "Responda explicando que nao ha resultados e sugira reformular a pergunta.",
    ].join("\n");
  }

  const items = products.map((product, index) => {
    const attributes = product.attributes.map((attribute) => `${attribute.key}: ${attribute.value}`).join(", ");

    return [
      `${index + 1}. ${product.name}`,
      `   ID: ${product.id}`,
      `   Categoria: ${product.category?.name ?? "Sem categoria"}`,
      `   Preco: R$ ${product.price.toFixed(2)}`,
      `   Descricao: ${product.description}`,
      `   Atributos: ${attributes || "Nenhum"}`,
    ].join("\n");
  });

  return [
    `Pergunta: ${question}`,
    "Contexto do catalogo:",
    ...items,
    "Instrucoes:",
    "- responda diretamente a pergunta;",
    "- use apenas os produtos listados;",
    "- cite nomes de produtos quando fizer sentido;",
    "- nao invente itens fora do contexto.",
  ].join("\n");
}

function fallbackAnswer(products: Array<{ name: string }>, question: string) {
  if (products.length === 0) {
    return `Nao encontrei produtos relevantes no catalogo para "${question}". Tente reformular a busca ou usar termos mais especificos.`;
  }

  const names = products.map((product) => product.name).join(", ");
  return `Encontrei estes itens como base para responder sobre "${question}": ${names}. A camada de RAG ainda esta usando fallback local porque a integracao com Groq nao foi configurada.`;
}

function mapSource(product: {
  id: string;
  name: string;
  category: { name: string };
  price: number;
}) {
  return {
    id: product.id,
    name: product.name,
    category: product.category?.name ?? "Sem categoria",
    price: product.price,
  };
}

function messageContentToText(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : ""))
      .join("")
      .trim();
  }

  return String(content ?? "").trim();
}

function parseAssistantPayload(content: unknown): CatalogAssistantPayload | null {
  const text = messageContentToText(content);

  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text) as Partial<CatalogAssistantPayload>;

    if (typeof parsed.answer !== "string") {
      return null;
    }

    return {
      answer: parsed.answer,
      summary: typeof parsed.summary === "string" ? parsed.summary : undefined,
      highlights: Array.isArray(parsed.highlights)
        ? parsed.highlights.filter((item): item is string => typeof item === "string")
        : undefined,
    };
  } catch {
    return null;
  }
}

function createCatalogSearchTool(productRepository: ProductRepositoryPort) {
  return tool(
    async (input: { query?: string; limit?: number }) => {
      const query = String(input?.query ?? "").trim();
      const limit = clampLimit(input?.limit);
      const products = await productRepository.search(query);
      const results = products.slice(0, limit).map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name ?? "Sem categoria",
        price: product.price,
        description: product.description,
        attributes: product.attributes.map((attribute) => `${attribute.key}: ${attribute.value}`),
      }));

      return JSON.stringify(
        {
          query,
          count: results.length,
          results,
        },
        null,
        2,
      );
    },
    {
      name: "search_catalog",
      description: "Busca produtos relevantes no catalogo com base em uma consulta de texto.",
      schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Texto de busca usado para localizar produtos relevantes.",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 5,
            description: "Numero maximo de produtos a retornar.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  );
}

function clampLimit(limit: number | undefined) {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return 5;
  }

  return Math.max(1, Math.min(5, Math.trunc(limit)));
}
