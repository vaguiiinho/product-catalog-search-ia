# ADR 0001 - Stack principal do projeto

## Status

Aprovado

## Contexto

O projeto precisa demonstrar um catalogo de produtos com busca semantica, com boa experiencia de front-end, backend coeso e baixa complexidade operacional.

## Decisao

Usar:

- `Next.js` para frontend;
- `NestJS` para API e workers;
- `PostgreSQL + pgvector` para persistencia e vetores.

## Alternativas consideradas

- `Django` no backend;
- backend separado em Python para a API principal;
- uso de vector database externa como infraestrutura adicional.

## Justificativa

- `TypeScript` unifica a stack e reduz troca de contexto;
- `NestJS` organiza bem modulos, services e integracoes;
- `PostgreSQL + pgvector` reduz dependencias e e suficiente para o escopo;
- `Next.js` entrega SEO, paginas publicas e boa demo visual.

## Consequencias

- menor complexidade operacional;
- mais facilidade para compartilhar tipos e contratos;
- menos risco de overengineering;
- possivel limite de escala, aceito pelo escopo de portfolio.

## Observacoes

Se o projeto evoluir para pipelines de ML mais pesadas, uma camada Python dedicada pode ser adicionada depois sem reescrever o sistema todo.
