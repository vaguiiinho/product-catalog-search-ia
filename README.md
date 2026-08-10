# Catálogo de Produtos com Busca Semântica

Aplicação Full Stack para catálogo de produtos com busca semântica, painel administrativo e arquitetura preparada para integrações com IA.

O projeto utiliza **Next.js, NestJS, PostgreSQL, pgvector, Docker e conceitos de RAG/LLM**, com foco em arquitetura, escalabilidade, documentação técnica e experiência de busca.

## Destaques técnicos

- Busca semântica com `pgvector`
- API estruturada em `NestJS`
- Frontend em `Next.js`
- Worker para ingestão e indexação
- Arquitetura documentada com C4 e ADRs
- Integração preparada para `LangChain` + `Groq`
- Ambientes containerizados com Docker
- Rate limiting e separação entre frontend, API e worker

## Stack

- **Frontend:** Next.js, TypeScript
- **Backend:** NestJS, TypeScript
- **Banco de dados:** PostgreSQL + pgvector
- **IA / RAG:** LangChain, Groq
- **Infraestrutura:** Docker, Docker Compose, Nginx
- **Arquitetura:** C4, ADRs, monorepo com aplicações desacopladas
