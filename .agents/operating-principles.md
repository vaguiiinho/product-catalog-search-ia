# Operating Principles

## Purpose

Define how agents should work in this repository so architecture, implementation and documentation stay aligned.

## General rules

- Read `.agents/project-architecture.md` before making decisions.
- Use `architect` for cross-cutting decisions and system boundaries.
- Use a specialist agent for work inside a single bounded area.
- Keep controllers thin, UI lean and infrastructure isolated.
- Record irreversible decisions in ADRs.
- Prefer small, explicit changes over broad speculative rewrites.

## Orchestration

- `architect` coordinates system-level direction.
- `nextjs-frontend` handles public UI and App Router work.
- `nestjs-backend` handles API, application services and repositories.
- `backend` is the conceptual backend specialist for Clean Architecture and DDD.
- `ingestion-worker` handles background processing and reindexing.
- `ai-rag` handles semantic retrieval and model orchestration.
- `data-vector-store` handles persistence and vector schema.
- `documentation` turns decisions into PRD, ADRs and checklists.

## Output expectations

- state the decision first;
- explain trade-offs briefly;
- list risks and mitigations;
- end with the next concrete step.

## Tests and validation

- include unit tests for domain and use cases when implementing backend logic;
- include controller or repository integration tests when relevant;
- verify frontend states for loading, empty, error and success;
- validate architecture changes against the C4 and ADRs.

