# PRD - Catalogo de Produtos com Busca Semantica

## Contexto

Este projeto e um catalogo de produtos para portfolio, com foco em demonstrar arquitetura full-stack, busca semantica e uma experiencia de consulta moderna.

A proposta da demo e simular uma integracao de `LLM`, `RAG` e `pgvector` sobre um sistema ja existente, de forma clara e apresentavel.

## Problema

Catalogos tradicionais dependem de busca textual simples e filtros manuais. Isso funciona, mas nao captura bem intencao do usuario.

## Objetivo

Construir um catalogo de produtos com:

- listagem e detalhe de produtos;
- busca semantica e filtros estruturados;
- painel administrativo para gestao do catalogo;
- pipeline de ingestao e reindexacao;
- documentacao arquitetural clara para portfolio.

## Publico-alvo

- recrutadores tecnicos;
- pessoas avaliando portfolio;
- desenvolvedor do projeto, para evolucao futura.

## Escopo do MVP

- homepage do catalogo;
- pagina de listagem com busca e filtros;
- pagina de detalhe do produto;
- painel administrativo simples;
- API de catalogo em NestJS;
- busca semantica com PostgreSQL + pgvector;
- pipeline de ingestao para gerar embeddings;
- documentacao de arquitetura e decisao.

## Fora de escopo no MVP

- carrinho e checkout;
- pagamentos;
- recomendacao personalizada com perfil de usuario;
- multi-loja ou multi-tenant;
- painel analitico completo.

## Requisitos funcionais

- cadastrar, editar, listar e remover produtos;
- organizar produtos por categorias e atributos;
- buscar por texto e por intencao semantica;
- aplicar filtros por categoria, preco, marca e disponibilidade;
- reindexar o catalogo quando os dados mudarem;
- expor dados para o frontend de forma consistente.

## Requisitos nao funcionais

- frontend com boa performance e SEO;
- API com contratos claros e validacao;
- pipeline de busca com baixa latencia para demo;
- arquitetura simples de entender em entrevista;
- codigo e documentacao organizados para extensao.

## Solucao proposta

- `Next.js` no frontend;
- `NestJS` na API e em workers;
- `PostgreSQL + pgvector` para persistencia e busca vetorial;
- `LlamaIndex` como camada preferencial de orquestracao da integracao LLM/RAG sobre o sistema existente;
- `LangChain` apenas se houver necessidade de agente depois.

No MVP, o worker gera embeddings deterministicos e persiste os vetores em `pgvector`, enquanto `LlamaIndex` ou `LangChain` representam a camada de orquestracao de `LLM` e `RAG` sobre a base existente, sem exigir um provedor externo real.

## Topologia do repositorio

O projeto sera desenvolvido como monorepo com apps independentes:

- `apps/web` - frontend;
- `apps/api` - backend principal;
- `apps/worker` - processamento em background;
- `packages/shared` - artefatos compartilhados puros, se necessario.

Cada app tera dependencias e scripts proprios, mas o fluxo de desenvolvimento e documentacao sera centralizado no mesmo repositorio.

## Orquestracao de agentes

O projeto usa agentes especializados para manter a arquitetura e a documentacao coerentes:

- `architect` define direcao tecnica e trade-offs;
- `backend` modela dominio e casos de uso;
- `nestjs-backend` implementa API, Prisma e testes;
- `nextjs-frontend` implementa interface e interacoes no Next.js;
- `ingestion-worker` trata ingestao, jobs e reindexacao;
- `ai-rag` trata recuperacao semantica e fluxo de IA;
- `data-vector-store` trata schema, indices e vetores;
- `documentation` produz PRD, ADRs e checklist.

## Criterios de sucesso

- o usuario encontra produtos por busca semantica;
- o sistema responde de forma previsivel e demonstravel;
- a arquitetura e clara em diagramas e documentos;
- o projeto parece realista, coeso e evolutivo.

## Riscos

- complexidade excessiva ao misturar muitas ferramentas de IA;
- qualidade baixa de busca se os dados do catalogo forem pobres;
- demo fraca se nao houver boa apresentacao de UI e resultados;
- schema de dados rigido demais para evoluir.

## Mitigacoes

- comecar com `LlamaIndex` apenas;
- enriquecer os dados do catalogo com atributos relevantes;
- usar busca hibrida com ranking simples;
- manter ADRs para registrar decisoes irreversiveis.

## Entregaveis

- aplicativo em `Next.js`;
- API em `NestJS`;
- pipeline de ingestao/indexacao;
- banco com `pgvector`;
- diagramas C4;
- PRD, ADRs e checklist de implementacao.
