import { DEFAULT_GROQ_MODEL, getGroqModel } from "./groq-chat-model.provider";

describe("Groq model configuration", () => {
  const originalModel = process.env.GROQ_MODEL;

  afterEach(() => {
    if (originalModel === undefined) {
      delete process.env.GROQ_MODEL;
    } else {
      process.env.GROQ_MODEL = originalModel;
    }
  });

  it("uses the development-friendly default model", () => {
    delete process.env.GROQ_MODEL;
    expect(getGroqModel()).toBe(DEFAULT_GROQ_MODEL);
    expect(DEFAULT_GROQ_MODEL).toBe("openai/gpt-oss-20b");
  });

  it("allows the model to be configured by environment", () => {
    process.env.GROQ_MODEL = "  custom/model  ";
    expect(getGroqModel()).toBe("custom/model");
  });
});
