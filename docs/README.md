# Documentacao

Arquivos principais do projeto:

- `PRD.md` - problema, escopo, requisitos e sucesso esperado;
- `adr/` - decisoes arquiteturais registradas, incluindo stack, busca semantica e orquestracao de agentes;
- `implementation-checklist.md` - execucao por fases.
- `adr/0005-monorepo-with-independent-apps.md` - estrategia de monorepo com apps independentes.
- `architecture-review.md` - revisao consolidada do desenho tecnico atual;
- `presentation-script.md` - roteiro curto para demonstracao do projeto.

## Estrutura inicial

- `apps/web` - frontend Next.js;
- `apps/api` - API NestJS;
- `apps/worker` - jobs e reindexacao;
- `packages/shared` - artefatos compartilhados puros futuros.

## Decisoes chave

- monorepo com apps independentes;
- deploy separado como possibilidade futura;
- contratos explicitamente documentados entre apps.
- C4 como diagrama principal de contexto e containers;
- roteiro de apresentacao alinhado ao estado real da aplicacao.
- demo de `LLM`, `RAG` e `pgvector` em um sistema ja existente, com integracao simulada no MVP.
