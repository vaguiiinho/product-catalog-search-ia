# Checklist de Implementacao

## Fase 1 - Fundacao

- [ ] validar a orquestracao de agentes e ADR 0004;
- [ ] definir dominio e entidades principais;
- [ ] criar repositório/base do projeto;
- [ ] configurar `Next.js`;
- [ ] configurar `NestJS`;
- [ ] configurar `PostgreSQL + pgvector`;
- [ ] criar estrutura de pastas e convencoes;
- [ ] registrar PRD e ADRs iniciais.

## Fase 2 - Catalogo

- [ ] modelar produtos, categorias, atributos e imagens;
- [ ] criar API de CRUD;
- [ ] criar telas publicas do catalogo;
- [ ] criar pagina de detalhe de produto;
- [ ] criar painel administrativo basico;
- [ ] validar contratos entre front e back.
- [ ] popular o catalogo com seed real via Prisma.

## Fase 3 - Busca semantica

- [ ] definir estrategia de ingestao;
- [ ] gerar embeddings dos produtos;
- [ ] armazenar vetores no banco;
- [ ] implementar busca hibrida;
- [ ] adicionar ranking de resultados;
- [ ] exibir justificativa simples da relevancia.

## Fase 4 - Qualidade

- [ ] revisar acessibilidade;
- [ ] revisar SEO e metadados;
- [ ] revisar performance de paginas principais;
- [ ] adicionar tratamento de erro e estados vazios;
- [ ] criar fixtures ou seed de dados para demo.

## Fase 5 - Portfolio

- [ ] revisar arquitetura e diagramas;
- [ ] atualizar README principal;
- [ ] documentar decisoes finais;
- [ ] preparar roteiro de apresentacao;
- [ ] validar fluxo completo de ponta a ponta.
