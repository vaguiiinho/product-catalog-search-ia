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
- a geracao de embeddings continua para a fase seguinte;
- o pipeline atual serve como esqueleto de ingestao e reindexacao.

## Execucao local

- `corepack pnpm --dir apps/worker dev`
- opcionalmente definir `INGESTION_API_URL` se a API nao estiver em `http://localhost:3001`
