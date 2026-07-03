# Worker

Processamento em background para ingestao e reindexacao.

## Responsabilidades

- importar dados;
- normalizar catalogo;
- gerar embeddings;
- reindexar vetores;
- executar tarefas assicronas.

## Estrategia atual

- a API e a fonte de verdade operacional;
- o worker consome `GET /api/products`;
- cada produto vira um documento semantico consolidado;
- o worker gera embeddings deterministicos locais para o MVP;
- os embeddings sao persistidos na API em uma tabela `pgvector`;
- o pipeline atual serve como esqueleto de ingestao, embedding e reindexacao;
- a demo usa esse fluxo para simular a integracao de `LLM` e `RAG` em um sistema ja existente;
- a camada de orquestracao de `RAG` recomendada para este repositorio e `LangChain` + `Groq`, mantida fora do worker;
- `LlamaIndex` fica como alternativa futura apenas se surgir a necessidade de um fluxo Python separado.

## Execucao local

- `corepack pnpm --dir apps/worker dev`
- opcionalmente definir `INGESTION_API_URL` se a API nao estiver em `http://localhost:3001`
