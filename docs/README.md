# Documentacao

Arquivos principais do projeto:

- `PRD.md` - problema, escopo, requisitos e sucesso esperado;
- `adr/` - decisoes arquiteturais registradas, incluindo stack, busca semantica e orquestracao de agentes;
- `implementation-checklist.md` - execucao por fases.
- `adr/0005-monorepo-with-independent-apps.md` - estrategia de monorepo com apps independentes.

## Estrutura inicial

- `apps/web` - frontend Next.js;
- `apps/api` - API NestJS;
- `apps/worker` - jobs e reindexacao;
- `packages/shared` - artefatos compartilhados puros futuros.

## Decisoes chave

- monorepo com apps independentes;
- deploy separado como possibilidade futura;
- contratos explicitamente documentados entre apps.
