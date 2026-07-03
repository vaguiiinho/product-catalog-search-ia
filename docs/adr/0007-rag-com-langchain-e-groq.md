# ADR 0007 - RAG com LangChain e Groq

## Status

Aprovado

## Contexto

O repositorio e inteiramente TypeScript e ja tem frontend, API e worker em NestJS/Next.js. Para a camada de RAG, a escolha precisa preservar essa uniformidade e evitar um desvio para um servico Python separado sem necessidade real.

A Groq oferece integracao oficial com `LangChain` em JavaScript/TypeScript, incluindo tool calling, structured output e modelos ja disponiveis para producao. Isso encaixa melhor no stack atual do projeto do que adotar `LlamaIndex` agora.

## Decisão

Adotar `LangChain` como camada de orquestracao da RAG no ecossistema TypeScript do projeto, com `Groq` como provedor de LLM.

Modelo padrao recomendado para a demo:

- `llama-3.3-70b-versatile` para qualidade de resposta;
- `llama-3.1-8b-instant` como alternativa de menor custo e latencia.

## Alternativas consideradas

- manter apenas busca hibrida sem LLM;
- usar `LlamaIndex` e criar um serviço Python dedicado;
- conectar Groq diretamente sem camada de orquestracao;
- usar um modelo local.

## Justificativa

- mantem a stack em TypeScript;
- reduz o custo de integracao e manutencao;
- aproveita a integração oficial `@langchain/groq`;
- permite tool calling e structured output sem redesenhar o sistema;
- mantem o worker focado em ingestao, embeddings e reindexacao.

## Consequências

- a camada de RAG fica mais explicita e proxima da API;
- a implementacao pode evoluir para respostas assistidas sem mexer no pipeline de ingestao;
- o worker continua responsavel por documentos e vetores;
- `LlamaIndex` deixa de ser a escolha preferencial para este repositorio, mas continua valido como alternativa futura se uma parte Python se tornar necessaria.

## Observações

Este ADR define a direcao recomendada para a implementacao da camada de RAG. O MVP atual continua simulando a parte de LLM/RAG ate essa integracao ser adicionada ao runtime.
