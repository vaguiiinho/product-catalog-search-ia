# Project Architecture

## Product goal

Build a portfolio-ready product catalog with semantic search, clear architecture and a polished user experience.

## Current stack direction

- `Next.js` for the frontend.
- `NestJS` for the backend API and workers.
- `PostgreSQL + pgvector` for persistence and vector search.
- `LangChain` for retrieval orchestration and RAG in the TypeScript stack.
- `Groq` as the LLM provider for assistant responses.
- `LlamaIndex` only as a future alternative if a Python-oriented ingestion or retrieval layer becomes necessary.

## Repository strategy

- Use a monorepo.
- Keep `apps/web`, `apps/api` and `apps/worker` independent.
- Give each app its own `package.json`, scripts and lifecycle.
- Keep `packages/shared` minimal and framework-agnostic.
- Assume future deploy separation even while developing in one repository.

## System boundaries

- Public frontend for search, browsing and product detail.
- Admin area for product management.
- Backend API for domain rules and data contracts.
- Worker layer for ingestion, normalization and reindexing.
- AI layer for semantic retrieval, tool calling and optional answer generation.
- Data layer for catalog records and embeddings.

## C4 mapping

- `Frontend` and `Admin App` map to `nextjs-frontend`.
- `Catalog API` maps to `nestjs-backend`.
- `Ingestion Worker` maps to `ingestion-worker`.
- `AI Pipeline` maps to `ai-rag`.
- `PostgreSQL + pgvector` maps to `data-vector-store`.
- `Documentation` is owned by `documentation`.

## Architecture rules

- Presentation must not contain business rules.
- Application services own use cases.
- Domain stays pure and framework-agnostic.
- Infrastructure isolates Prisma, storage and external services.
- Search should combine structured filters with semantic retrieval.
- The worker stays outside the agent layer: it prepares documents, embeddings and reindexing, but does not orchestrate LLM calls.
- Apps must communicate through explicit contracts, not internal runtime imports.

## Documentation rules

- PRD defines problem, scope and success criteria.
- ADRs capture decisions that are hard to reverse.
- The implementation checklist tracks phased delivery.
- The agent index in `.agents/README.md` is the entry point for orchestration.
