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
