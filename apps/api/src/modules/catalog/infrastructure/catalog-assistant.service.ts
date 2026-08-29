import { Inject, Injectable, Logger, Optional } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { GROQ_CHAT_MODEL, ChatModelLike, getGroqModel } from "./groq-chat-model.provider";
import {
  CatalogAssistantPort,
  CatalogAssistantResponse,
} from "../application/ports/catalog-assistant.port";
import { ProductSearchQuery } from "../domain/value-objects/product-search-query.value-object";

type CatalogAssistantPayload = {
  answer: string;
  summary?: string;
  highlights?: string[];
};

@Injectable()
export class CatalogAgentService implements CatalogAssistantPort {
  private readonly logger = new Logger(CatalogAgentService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Optional()
    @Inject(GROQ_CHAT_MODEL)
    private readonly chatModel: ChatModelLike | null,
  ) {}

  async answerQuestion(question: string): Promise<CatalogAssistantResponse> {
    const normalizedQuestion = question.trim();
    const searchQuery = ProductSearchQuery.create(normalizedQuestion);
    const products = searchQuery.price === undefined
      ? await this.productRepository.search(searchQuery.text)
      : await this.productRepository.search(searchQuery.text, { price: searchQuery.price });
    const contextProducts = products.slice(0, 5);
    const context = buildContext(normalizedQuestion, contextProducts);
    const model = getGroqModel();

    if (!this.chatModel) {
      return {
        question: normalizedQuestion,
        answer: fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: true,
        notice: "A integração com a IA não está configurada. Defina GROQ_API_KEY para habilitá-la.",
        sources: contextProducts.map(mapSource),
      };
    }

    try {
      const response = await this.chatModel.invoke(
        [
          {
            role: "system",
            content:
              "Voce e um assistente de catalogo. Responda em portugues usando somente o contexto fornecido. Retorne um JSON valido com as chaves answer, summary e highlights. Se faltar informacao, diga isso de forma objetiva e nao invente produtos.",
          },
          {
            role: "user",
            content: context,
          },
        ],
      );

      const payload = parseAssistantPayload(response.content);

      return {
        question: normalizedQuestion,
        answer: payload?.answer?.trim() || fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: false,
        sources: contextProducts.map(mapSource),
      };
    } catch (error) {
      const failure = getGroqFailure(error);
      this.logger.warn(
        `Fallback da Groq acionado: model=${model} status=${failure.status ?? "unknown"} code=${failure.code ?? "unknown"} type=${failure.type}`,
      );

      return {
        question: normalizedQuestion,
        answer: fallbackAnswer(contextProducts, normalizedQuestion),
        model,
        retrievedCount: contextProducts.length,
        usedFallback: true,
        notice: getGroqFailureNotice(error),
        sources: contextProducts.map(mapSource),
      };
    }
  }
}

function getGroqFailureNotice(error: unknown) {
  const { status } = getGroqFailure(error);

  if (status === 401) {
    return "A chave da Groq foi recusada. Verifique ou gere uma nova GROQ_API_KEY.";
  }

  if (status === 403) {
    return "A conta da Groq não possui acesso ao modelo configurado. Altere GROQ_MODEL ou revise o plano da conta.";
  }

  if (status === 400) {
    return "A Groq recusou a solicitação enviada ao modelo. Consulte os logs da API para identificar o modelo utilizado.";
  }

  if (status !== 429) {
    return status && status >= 500
      ? "A Groq está temporariamente indisponível. Exibimos uma resposta local."
      : "Não foi possível comunicar com a Groq. Exibimos uma resposta local; consulte os logs da API.";
  }

  const retryAfterSeconds = getRetryAfterSeconds(error) ?? 60;
  const retryAfterLabel = retryAfterSeconds >= 60
    ? `${Math.ceil(retryAfterSeconds / 60)} minuto${retryAfterSeconds > 60 ? "s" : ""}`
    : `${retryAfterSeconds} segundos`;

  return `A IA atingiu o limite temporário de uso. Exibimos uma resposta local; tente novamente em cerca de ${retryAfterLabel}.`;
}

function getGroqFailure(error: unknown) {
  const record = asRecord(error);
  const response = asRecord(record?.response);
  const nestedError = asRecord(record?.error);
  const status = toHttpStatus(record?.status ?? record?.statusCode ?? response?.status);
  const codeValue = record?.code ?? nestedError?.code;

  return {
    status,
    code: typeof codeValue === "string" ? codeValue : undefined,
    type: error instanceof Error ? error.name : typeof error,
  };
}

function toHttpStatus(value: unknown) {
  const status = Number(value);
  return Number.isInteger(status) && status >= 100 && status <= 599 ? status : undefined;
}

function getRetryAfterSeconds(error: unknown) {
  const record = asRecord(error);
  const response = asRecord(record?.response);
  const headers = response?.headers ?? record?.headers;
  const rawValue = getHeader(headers, "retry-after");
  const seconds = Number(rawValue);

  return Number.isInteger(seconds) && seconds > 0 && seconds <= 3600 ? seconds : undefined;
}

function getHeader(headers: unknown, name: string) {
  if (headers && typeof headers === "object" && "get" in headers && typeof headers.get === "function") {
    return headers.get(name);
  }

  const record = asRecord(headers);
  return record?.[name] ?? record?.[name.toLowerCase()];
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
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
  return `Encontrei estes itens como base para responder sobre "${question}": ${names}. A resposta foi gerada localmente porque a IA externa nao esta disponivel no momento.`;
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
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        const record = asRecord(part);
        return typeof record?.text === "string" ? record.text : "";
      })
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
    const parsed = JSON.parse(extractJsonObject(text)) as Partial<CatalogAssistantPayload>;

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
    return { answer: text };
  }
}

function extractJsonObject(text: string) {
  const withoutFence = text
    .replace(/^\s*```(?:json)?\s*/iu, "")
    .replace(/\s*```\s*$/u, "")
    .trim();
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");

  return firstBrace >= 0 && lastBrace > firstBrace
    ? withoutFence.slice(firstBrace, lastBrace + 1)
    : withoutFence;
}
