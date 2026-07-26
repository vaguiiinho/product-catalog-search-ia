# API

Backend principal em NestJS.

## Responsabilidades

- CRUD do catalogo;
- contratos HTTP;
- validacao de DTOs;
- regras de negocio;
- resposta assistida baseada em contexto do catalogo;
- integracao com Prisma e PostgreSQL.

## Autenticação administrativa

Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `JWT_SECRET` no `.env`. O login é feito em
`POST /api/auth/login` com `{ "email", "password" }`; use o `accessToken` retornado no
cabeçalho `Authorization: Bearer <token>` para operações de escrita, incluindo
`POST /api/products`. `GET /api/auth/me` valida o token. A rota de indexação é usada pelo
worker e permanece separada da autenticação administrativa.

## Seed de catálogo

`prisma:seed` mantém/atualiza os produtos-base sem apagar o catálogo. Para acrescentar produtos
aleatórios, execute:

```bash
npm run prisma:seed -- -- --count=50
```

Itens incluídos pelo seed recebem `origem=demo`, `estoque=5 unidades` e
`disponibilidade=em estoque`. Os itens aleatórios também incluem termos de uso e palavras-chave
por categoria para tornar a demonstração de busca mais realista.

Na imagem Docker de producao, use o seed JavaScript ja compilado, sem `pnpm` ou `ts-node`:

```bash
docker compose exec api node seed-dist/prisma/seed.js --count=50
```
