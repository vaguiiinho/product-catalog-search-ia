# Catalogo de Produtos com Busca Semantica

Projeto de portfolio para demonstrar um catalogo de produtos com busca semantica, frontend moderno, backend estruturado e documentacao arquitetural clara.

## Objetivo

Construir uma aplicacao que permita:

- navegar por produtos;
- pesquisar por texto e por intencao;
- aplicar filtros estruturados;
- administrar o catalogo;
- mostrar uma arquitetura consistente e facil de explicar.

## Stack proposta

- `Next.js` para o frontend;
- `NestJS` para a API e workers;
- `PostgreSQL + pgvector` para persistencia e busca vetorial;
- `LlamaIndex` para ingestao, retrieval e RAG;
- `LangChain` apenas se houver necessidade futura de agente.

## Arquitetura

O sistema esta organizado em:

- `Frontend` - experiencia publica, SEO, busca e detalhe de produto;
- `Admin App` - gestao do catalogo;
- `Catalog API` - CRUD, contratos e regras de negocio;
- `Ingestion Worker` - importacao, normalizacao e reindexacao;
- `PostgreSQL + pgvector` - dados e vetores;
- `AI Pipeline` - recuperacao semantica e base para RAG.

Veja o diagrama C4 em [c4-diagram.puml](./c4-diagram.puml).

## Estrutura inicial

O monorepo esta organizado em:

- `apps/web` - Next.js para o frontend publico e admin;
- `apps/api` - NestJS para a API principal;
- `apps/worker` - processamento em background;
- `packages/shared` - utilitarios e contratos compartilhados no futuro.

## Orquestracao de agentes

Os agentes do projeto ficam em [`.agents/README.md`](./.agents/README.md) e sao organizados por responsabilidade tecnica:

- `architect` coordena decisoes de alto nivel;
- `backend` e `nestjs-backend` cobrem dominio, use cases e API;
- `nextjs-frontend` cobre a experiencia em Next.js;
- `ingestion-worker`, `ai-rag` e `data-vector-store` cobrem as demais camadas;
- `documentation` transforma decisoes em PRD, ADRs e checklist.

## Documentacao

- [PRD](./docs/PRD.md)
- [Checklist de implementacao](./docs/implementation-checklist.md)
- [Documentacao do projeto](./docs/README.md)
- [ADR 0001 - stack](./docs/adr/0001-stack-nextjs-nestjs-pgvector.md)
- [ADR 0002 - busca semantica](./docs/adr/0002-semantic-search-with-llamaindex.md)
- [ADR 0003 - documentacao como entrega](./docs/adr/0003-documentation-and-deliverables.md)
- [ADR 0004 - orquestracao de agentes](./docs/adr/0004-agent-orchestration.md)

## Agentes

Os agentes do projeto estao em [`.agents/README.md`](./.agents/README.md) e cobrem:

- arquitetura;
- frontend;
- API;
- ingestion worker;
- IA e RAG;
- dados e vector store;
- documentacao.

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

## Proximo passo

Siga a checklist em [docs/implementation-checklist.md](./docs/implementation-checklist.md) para iniciar a implementacao por fases.
