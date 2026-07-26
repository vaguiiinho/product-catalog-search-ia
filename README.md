# Catalogo de Produtos com Busca Semantica

Projeto de portfolio para demonstrar um catalogo de produtos com busca semantica, frontend moderno, backend estruturado e documentacao arquitetural clara.

## O que este projeto demonstra

- experiencia publica com busca, detalhe de produto e SEO;
- painel administrativo basico para gestao do catalogo;
- API em `NestJS` com contratos claros;
- pipeline de ingestao e base para indexacao semantica;
- documentacao tecnica suficiente para explicar decisoes e trade-offs.

O foco da demo e mostrar uma integracao simulada de `LLM`, `RAG` e `pgvector` em cima de um sistema ja existente, sem depender de servicos externos reais no MVP.

## Stack

- `Next.js` para o frontend;
- `NestJS` para a API e workers;
- `PostgreSQL + pgvector` para persistencia e busca vetorial;
- `LangChain` como camada preferencial de orquestracao da integracao LLM/RAG no stack TypeScript;
- `Groq` como provedor de LLM para a camada assistida;
- `LlamaIndex` apenas se uma futura parte Python exigir um fluxo separado.

## Arquitetura

O sistema esta dividido em:

- `Frontend` - experiencia publica, SEO, busca e detalhe de produto;
- `Admin App` - gestao do catalogo;
- `Catalog API` - CRUD, contratos, regras de negocio e resposta assistida com Groq;
- `Ingestion Worker` - importacao, normalizacao e reindexacao;
- `PostgreSQL + pgvector` - dados e vetores;
- `AI Pipeline` - recuperacao semantica, prompts e respostas assistidas.

Veja o diagrama C4 em [c4-diagram.puml](./c4-diagram.puml) e a revisao consolidada em [docs/architecture-review.md](./docs/architecture-review.md).

## Estrutura do monorepo

- `apps/web` - Next.js para o frontend publico e admin;
- `apps/api` - NestJS para a API principal;
- `apps/worker` - processamento em background;
- `packages/shared` - utilitarios e contratos compartilhados no futuro.

O repositorio adota apps independentes para manter o deploy futuro desacoplado, mesmo durante o desenvolvimento local.
O fluxo de busca semantica atual deixa explicito que o worker gera embeddings e persiste os vetores. Quando a camada de `RAG` for ativada no runtime, a combinacao recomendada para este repo e `LangChain` + `Groq`, mantendo a stack em TypeScript. No MVP, isso continua demonstrado com embeddings deterministicos locais e `pgvector`, sem acoplar a demo a provedores externos.
Na API, a implementacao usa um agent fino para recuperar contexto, chamar tool e compor a resposta final.

## Documentacao

- [PRD](./docs/PRD.md)
- [Checklist de implementacao](./docs/implementation-checklist.md)
- [Documentacao do projeto](./docs/README.md)
- [Revisao de arquitetura](./docs/architecture-review.md)
- [Roteiro de apresentacao](./docs/presentation-script.md)
- [ADR 0001 - stack](./docs/adr/0001-stack-nextjs-nestjs-pgvector.md)
- [ADR 0002 - busca semantica](./docs/adr/0002-semantic-search-with-llamaindex.md)
- [ADR 0003 - documentacao como entrega](./docs/adr/0003-documentation-and-deliverables.md)
- [ADR 0004 - orquestracao de agentes](./docs/adr/0004-agent-orchestration.md)
- [ADR 0005 - monorepo com apps independentes](./docs/adr/0005-monorepo-with-independent-apps.md)
- [ADR 0007 - RAG com LangChain e Groq](./docs/adr/0007-rag-com-langchain-e-groq.md)
- [ADR 0009 - ambiente e deploy OCI](./docs/adr/0009-environment-and-oci-deployment.md)

## Agentes

Os agentes do projeto ficam em [`.agents/README.md`](./.agents/README.md) e cobrem arquitetura, frontend, API, worker, IA, vector store e documentacao.

## Escopo do MVP

- homepage do catalogo;
- listagem e pagina de detalhe;
- busca semantica e filtros;
- painel administrativo basico;
- API em `NestJS`;
- indexacao com `pgvector`;
- documentacao completa do desenho tecnico.

## Fora de escopo

- checkout e pagamentos;
- recomendacao personalizada;
- multi-loja;
- analytics completo.

## Como rodar

1. Instale as dependências:

   ```bash
   corepack pnpm install
   ```

2. Crie os arquivos locais de ambiente. Eles não são versionados:

   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   cp apps/worker/.env.example apps/worker/.env
   ```

3. Edite os valores sensíveis em `apps/api/.env`: `GROQ_API_KEY`, credenciais do administrador e
   `JWT_SECRET`. Ajuste também a senha em `.env`; o Compose a usa para inicializar PostgreSQL.

4. Suba a stack:

   ```bash
   docker compose up -d --build
   ```

5. Popule o catálogo, se necessário:

   ```bash
   docker compose exec api node seed-dist/prisma/seed.js
   docker compose exec api node seed-dist/prisma/seed.js --count=50
   ```

6. Para desenvolvimento fora do Docker, use `corepack pnpm dev:web`, `corepack pnpm dev:api` e
   `corepack pnpm dev:worker`. Valide com `corepack pnpm lint` e `corepack pnpm test`.

## Variáveis de ambiente e URLs

Cada arquivo possui um `.env.example` versionado e um `.env` local ignorado pelo Git:

| Arquivo | Responsabilidade |
| --- | --- |
| `.env` | Credenciais do PostgreSQL usado pelo Docker Compose. |
| `apps/api/.env` | Banco de desenvolvimento local, Groq, credenciais admin, JWT e CORS direto no desenvolvimento. |
| `apps/web/.env` | `API_URL` interna para Server Components e `SITE_URL` para metadata, sitemap e robots. |
| `apps/worker/.env` | `API_URL` usada pelo processo de indexação. |

No Compose, as URLs internas são substituídas por `http://api:3001`. Publicamente, o Nginx expõe
somente a porta `80`: o web fica em `/` e a API em `/api`. Assim, o navegador não acessa
`api:3001` e não precisa de CORS. `CORS_ORIGIN=http://localhost:3000` existe apenas para quem
executa o frontend e a API diretamente na máquina.

## Limites de requisição

O Nginx limita acessos diretos por IP e a API aplica o mesmo controle aos fluxos que passam pelo
Next.js. Assistente e login aceitam até 5 solicitações por minuto; a criação de produtos, 20 por
minuto. Ao atingir o limite, a resposta é `429`, inclui o cabeçalho `Retry-After` e informa
em quantos segundos tentar novamente. Se a Groq atingir a própria cota, o assistente preserva o
catálogo e exibe a resposta local com um aviso de nova tentativa.

O container da API cria o schema apenas quando o banco esta vazio. Em bancos existentes, use
migrations para alteracoes estruturais; o startup nao executa `prisma db push` para evitar perda
de dados de indices vetoriais persistidos.

## Proximo passo

Use a checklist em [docs/implementation-checklist.md](./docs/implementation-checklist.md) como guia da evolucao do projeto.
