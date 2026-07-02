# Agents

Este diretorio organiza os agentes por responsabilidade tecnica.

## Lista

- `architect`: define arquitetura, limites de sistema, trade-offs e plano tecnico.
- `backend`: modela dominio, casos de uso, repositorios e limites entre camadas.
- `nestjs-backend`: implementa APIs REST com Prisma, validacao e testes.
- `nextjs-frontend`: implementa a experiencia publica e administrativa no Next.js.
- `frontend`: agente generico de telas, UX, SEO, performance e responsividade no Next.js.
- `api`: agente generico de contratos, regras de negocio e integracoes no NestJS.
- `ingestion-worker`: cuida de importacao, normalizacao, jobs e reindexacao.
- `ai-rag`: projeta busca semantica, retrieval, embeddings e fluxo de IA.
- `data-vector-store`: modela persistencia, relacoes, indices e vetores.
- `documentation`: produz PRD, ADR, decisoes arquiteturais e checklist de implementacao.

## Arquivos de base

- [operating-principles.md](./operating-principles.md)
- [project-architecture.md](./project-architecture.md)

## Como usar

- Use `architect` quando a decisao afetar a estrutura geral do sistema.
- Use `backend` para modelagem e desenho de dominio.
- Use `nestjs-backend` para implementacao da API e dos repositorios.
- Use `nextjs-frontend` para telas e interacoes em Next.js.
- Use um especialista quando a tarefa estiver concentrada em uma parte do C4.
- Use `documentation` quando o foco for registrar ou formalizar decisoes e planos.
- Prefira `nestjs-backend` e `nextjs-frontend` para este projeto; use `frontend` e `api` apenas quando quiser uma visao mais generica.
