import { ChatGroq } from "@langchain/groq";

export const GROQ_CHAT_MODEL = Symbol("GROQ_CHAT_MODEL");

export type ChatModelLike = {
  invoke(
    messages: Array<{ role: string; content: string }>,
    options?: Record<string, unknown>,
  ): Promise<{ content: unknown }>;
};

export function createGroqChatModel(): ChatModelLike | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return new ChatGroq({
    apiKey,
    model: process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile",
    temperature: 0.2,
  });
}
