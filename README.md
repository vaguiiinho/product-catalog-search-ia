# Catalogo de Produtos com Busca Semantica

Projeto de portfolio para demonstrar um catalogo de produtos com busca semantica, frontend moderno, backend estruturado e documentacao arquitetural clara.

## O que este projeto demonstra

- experiencia publica com busca, detalhe de produto e SEO;
- painel administrativo basico para gestao do catalogo;
- API em `NestJS` com contratos claros;
- pipeline de ingestao e base para indexacao semantica;
- documentacao tecnica suficiente para explicar decisoes e trade-offs.

O foco da demo e mostrar uma integracao simulada de `LLM`, `RAG` e `pgvector` em cima de um sistema ja existente, sem depender de servicos externos reais no MVP.

## Stack

- `Next.js` para o frontend;
- `NestJS` para a API e workers;
- `PostgreSQL + pgvector` para persistencia e busca vetorial;
- `LlamaIndex` como referencia conceitual da camada de ingestao e retrieval;
- `LangChain` apenas se houver necessidade futura de agente.

## Arquitetura

O sistema esta dividido em:

- `Frontend` - experiencia publica, SEO, busca e detalhe de produto;
- `Admin App` - gestao do catalogo;
- `Catalog API` - CRUD, contratos e regras de negocio;
- `Ingestion Worker` - importacao, normalizacao e reindexacao;
- `PostgreSQL + pgvector` - dados e vetores;
- `AI Pipeline` - recuperacao semantica e base conceitual para RAG.

Veja o diagrama C4 em [c4-diagram.puml](./c4-diagram.puml) e a revisao consolidada em [docs/architecture-review.md](./docs/architecture-review.md).

## Estrutura do monorepo

- `apps/web` - Next.js para o frontend publico e admin;
- `apps/api` - NestJS para a API principal;
- `apps/worker` - processamento em background;
- `packages/shared` - utilitarios e contratos compartilhados no futuro.

O repositorio adota apps independentes para manter o deploy futuro desacoplado, mesmo durante o desenvolvimento local.
O fluxo de busca semantica atual simula a integracao com `LLM` e `RAG` usando `pgvector` e embeddings deterministicos locais, o que ajuda a demonstrar a arquitetura sem acoplar o MVP a provedores externos.

## Documentacao

- [PRD](./docs/PRD.md)
- [Checklist de implementacao](./docs/implementation-checklist.md)
- [Documentacao do projeto](./docs/README.md)
- [Revisao de arquitetura](./docs/architecture-review.md)
- [Roteiro de apresentacao](./docs/presentation-script.md)
- [ADR 0001 - stack](./docs/adr/0001-stack-nextjs-nestjs-pgvector.md)
- [ADR 0002 - busca semantica](./docs/adr/0002-semantic-search-with-llamaindex.md)
- [ADR 0003 - documentacao como entrega](./docs/adr/0003-documentation-and-deliverables.md)
- [ADR 0004 - orquestracao de agentes](./docs/adr/0004-agent-orchestration.md)
- [ADR 0005 - monorepo com apps independentes](./docs/adr/0005-monorepo-with-independent-apps.md)

## Agentes

Os agentes do projeto ficam em [`.agents/README.md`](./.agents/README.md) e cobrem arquitetura, frontend, API, worker, IA, vector store e documentacao.

## Escopo do MVP

- homepage do catalogo;
- listagem e pagina de detalhe;
- busca semantica e filtros;
- painel administrativo basico;
- API em `NestJS`;
- indexacao com `pgvector`;
- documentacao completa do desenho tecnico.

## Fora de escopo

- checkout e pagamentos;
- recomendacao personalizada;
- multi-loja;
- analytics completo.

## Como rodar

- instalar dependencias: `corepack pnpm install`
- subir o banco: `docker compose up -d postgres`
- popular o banco: `corepack pnpm --dir apps/api prisma:seed`
- validar tudo: `npm run lint` e `npm run test`
- iniciar frontend: `npm run dev:web`
- iniciar backend: `npm run dev:api`
- iniciar worker: `npm run dev:worker`

## Proximo passo

Use a checklist em [docs/implementation-checklist.md](./docs/implementation-checklist.md) como guia da evolucao do projeto.
