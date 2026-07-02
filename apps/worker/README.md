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
- o worker gera embeddings determinísticos locais para o MVP;
- os embeddings são persistidos na API em uma tabela `pgvector`;
- o pipeline atual serve como esqueleto de ingestao, embedding e reindexacao.

## Execucao local

- `corepack pnpm --dir apps/worker dev`
- opcionalmente definir `INGESTION_API_URL` se a API nao estiver em `http://localhost:3001`
