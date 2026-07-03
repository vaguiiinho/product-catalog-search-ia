import { Inject, Injectable, Optional } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from "../domain/product.repository.port";
import { GROQ_CHAT_MODEL, ChatModelLike } from "./groq-chat-model.provider";

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

@Injectable()
export class CatalogAssistantService {
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
    const model = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

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
      const response = await this.chatModel.invoke([
        {
          role: "system",
          content:
            "Voce e um assistente de catalogo. Responda em portugues, usando somente o contexto fornecido. Se faltar informacao, diga isso de forma objetiva e nao invente produtos.",
        },
        {
          role: "user",
          content: context,
        },
      ]);

      return {
        question: normalizedQuestion,
        answer: messageContentToText(response.content) || fallbackAnswer(contextProducts, normalizedQuestion),
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

