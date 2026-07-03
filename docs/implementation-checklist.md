# Checklist de Implementacao

Legenda:

- `[x]` concluido
- `[~]` parcial ou dependente de outras fases
- `[ ]` pendente

## Fase 1 - Fundacao

- [x] validar a orquestracao de agentes e ADR 0004;
- [x] definir dominio e entidades principais;
- [x] criar repositório/base do projeto;
- [x] configurar `Next.js`;
- [x] configurar `NestJS`;
- [x] configurar `PostgreSQL + pgvector`;
- [x] criar estrutura de pastas e convencoes;
- [x] registrar PRD e ADRs iniciais.

## Fase 2 - Catalogo

- [x] modelar produtos, categorias, atributos e imagens;
- [x] criar API de CRUD;
- [x] criar telas publicas do catalogo;
- [x] criar pagina de detalhe de produto;
- [x] criar painel administrativo basico;
- [x] validar contratos entre front e back.
- [x] popular o catalogo com seed real via Prisma.

## Fase 3 - Busca semantica

- [x] definir estrategia de ingestao;
- [x] gerar embeddings dos produtos;
- [x] armazenar vetores no banco;
- [x] implementar busca hibrida;
- [x] adicionar ranking de resultados;
- [x] exibir justificativa simples da relevancia.

## Fase 4 - Qualidade

- [~] revisar acessibilidade; parte da base visual ja tem semântica e estados dedicados, mas falta auditoria completa.
- [x] revisar SEO e metadados;
- [~] revisar performance de paginas principais; build e rotas estaticas/dinamicas validadas, mas falta profiling dedicado.
- [x] adicionar tratamento de erro e estados vazios;
- [x] criar fixtures ou seed de dados para demo.

## Fase 5 - Portfolio

- [x] revisar arquitetura e diagramas;
- [x] atualizar README principal;
- [x] documentar decisoes finais;
- [x] preparar roteiro de apresentacao;
- [x] validar fluxo completo de ponta a ponta.

## Fase 6 - Refatoracao de demo

- [x] alinhar a narrativa para `LLM`, `RAG` e `pgvector` simulados;
- [x] atualizar PRD, README e ADRs para refletir a demo sobre sistema existente;
- [x] revisar o roteiro de apresentacao com a nova proposta;
- [x] deixar explicito que o worker faz embeddings e persistencia vetorial;
- [x] deixar explicito que `LangChain` + `Groq` pode orquestrar a integracao LLM/RAG sobre o sistema existente;
- [x] revisar a copy do frontend para evitar promessas de integracao real com LLM externo;
- [x] validar se a demonstracao verbal destaca claramente o papel do worker, embeddings e vetor persistido;
- [x] fazer uma passagem final de consistencia entre checklist, roteiro e arquitetura.

## Fase 7 - RAG com Groq

- [x] integrar `LangChain` no runtime da API;
- [x] conectar `Groq` como provedor de LLM;
- [x] definir modelo padrao (`llama-3.3-70b-versatile`) e fallback (`llama-3.1-8b-instant`);
- [x] expor uma rota de resposta assistida baseada em contexto do catalogo;
- [ ] validar tool calling ou structured output, se a demo pedir;
- [ ] revisar o roteiro da apresentacao com a camada de RAG em runtime.
