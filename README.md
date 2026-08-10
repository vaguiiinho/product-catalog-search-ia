# Catálogo de Produtos com Busca Semântica

Aplicação Full Stack para catálogo de produtos com busca semântica, painel administrativo e arquitetura preparada para integrações com IA.

O projeto utiliza **Next.js, NestJS, PostgreSQL, pgvector, Docker e conceitos de RAG/LLM**, com foco em arquitetura, escalabilidade, documentação técnica e experiência de busca.

---

## Destaques técnicos

- Busca semântica com `pgvector`
- API estruturada em `NestJS`
- Frontend em `Next.js`
- Worker para ingestão e indexação
- Arquitetura documentada com C4 e ADRs
- Integração preparada para `LangChain` + `Groq`
- Ambientes containerizados com Docker
- Rate limiting na aplicação
- Separação entre frontend, API e worker
- Estratégia preparada para evolução independente dos serviços

---

## Stack

### Frontend
- Next.js
- TypeScript

### Backend
- NestJS
- TypeScript

### Banco de dados
- PostgreSQL
- pgvector

### IA / RAG
- LangChain
- Groq

### Infraestrutura
- Docker
- Docker Compose
- Nginx

### Arquitetura
- C4 Model
- ADRs
- Monorepo com aplicações desacopladas

---

## O que o projeto demonstra

- experiência de catálogo público com busca, detalhes de produtos e SEO;
- painel administrativo para gestão do catálogo;
- API com contratos claros e separação de responsabilidades;
- pipeline de ingestão e indexação semântica;
- uso de busca vetorial;
- integração preparada para fluxos de RAG e LLM;
- documentação técnica com decisões arquiteturais e trade-offs;
- separação entre aplicação web, API, worker e persistência.

---

## Inteligência Artificial e Busca Semântica

A arquitetura foi preparada para suportar fluxos de busca semântica e RAG utilizando `pgvector`, `LangChain` e `Groq`.

No MVP, os embeddings podem ser executados de forma determinística/local para manter a aplicação independente de provedores externos, enquanto a estrutura já permite evolução para integrações reais com LLMs.

O fluxo principal consiste em:

1. ingestão e normalização dos dados;
2. geração de embeddings;
3. persistência dos vetores no PostgreSQL;
4. recuperação semântica;
5. montagem do contexto;
6. geração de resposta assistida.

---

## Arquitetura

O sistema é dividido em componentes independentes:

- `Frontend` — catálogo público, SEO, busca e detalhes dos produtos;
- `Admin App` — gerenciamento do catálogo;
- `Catalog API` — regras de negócio, CRUD e integração com serviços de IA;
- `Ingestion Worker` — importação, normalização e indexação;
- `PostgreSQL + pgvector` — persistência dos dados e vetores;
- `AI Pipeline` — recuperação de contexto e respostas assistidas.

A separação entre aplicações permite evolução, manutenção e deploy independentes.

Veja também:

- [Diagrama C4](./c4-diagram.puml)
- [Revisão de arquitetura](./docs/architecture-review.md)

---

## Estrutura do monorepo

```text
.
├── apps
│   ├── web
│   ├── api
│   └── worker
├── packages
│   └── shared
├── docs
├── c4-diagram.puml
└── docker-compose.yml
