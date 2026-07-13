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
- `LangChain` como camada preferencial de orquestracao da integracao LLM/RAG no stack TypeScript;
- `Groq` como provedor de LLM para a camada assistida;
- `LlamaIndex` apenas se uma futura parte Python exigir um fluxo separado.

## Arquitetura

O sistema esta dividido em:

- `Frontend` - experiencia publica, SEO, busca e detalhe de produto;
- `Admin App` - gestao do catalogo;
- `Catalog API` - CRUD, contratos, regras de negocio e resposta assistida com Groq;
- `Ingestion Worker` - importacao, normalizacao e reindexacao;
- `PostgreSQL + pgvector` - dados e vetores;
- `AI Pipeline` - recuperacao semantica, prompts e respostas assistidas.

Veja o diagrama C4 em [c4-diagram.puml](./c4-diagram.puml) e a revisao consolidada em [docs/architecture-review.md](./docs/architecture-review.md).

## Estrutura do monorepo

- `apps/web` - Next.js para o frontend publico e admin;
- `apps/api` - NestJS para a API principal;
- `apps/worker` - processamento em background;
- `packages/shared` - utilitarios e contratos compartilhados no futuro.

O repositorio adota apps independentes para manter o deploy futuro desacoplado, mesmo durante o desenvolvimento local.
O fluxo de busca semantica atual deixa explicito que o worker gera embeddings e persiste os vetores. Quando a camada de `RAG` for ativada no runtime, a combinacao recomendada para este repo e `LangChain` + `Groq`, mantendo a stack em TypeScript. No MVP, isso continua demonstrado com embeddings deterministicos locais e `pgvector`, sem acoplar a demo a provedores externos.
Na API, a implementacao usa um agent fino para recuperar contexto, chamar tool e compor a resposta final.

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
- [ADR 0007 - RAG com LangChain e Groq](./docs/adr/0007-rag-com-langchain-e-groq.md)

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
- preparar o ambiente de deploy: `cp .env.deploy.example .env`
- subir a stack: `docker compose up -d --build`
- popular o banco na stack Docker: `docker compose exec api node seed-dist/prisma/seed.js`
- adicionar produtos aleatorios: `docker compose exec api node seed-dist/prisma/seed.js --count=50`
- validar tudo: `npm run lint` e `npm run test`
- iniciar frontend: `npm run dev:web`
- iniciar backend: `npm run dev:api`
- iniciar worker: `npm run dev:worker`

O container da API cria o schema apenas quando o banco esta vazio. Em bancos existentes, use
migrations para alteracoes estruturais; o startup nao executa `prisma db push` para evitar perda
de dados de indices vetoriais persistidos.

## Proximo passo

Use a checklist em [docs/implementation-checklist.md](./docs/implementation-checklist.md) como guia da evolucao do projeto.
