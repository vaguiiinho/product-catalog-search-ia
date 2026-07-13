# ADR 0008 - Autenticacao do painel administrativo

## Status

Aprovado

## Contexto

O painel administrativo criava produtos sem exigir uma sessao autenticada. A aplicacao possui frontend Next.js, API NestJS e um worker que deve continuar autenticando apenas pelas rotas publicas de ingestao.

## Decisao

- usar credenciais de administrador definidas por variaveis de ambiente;
- emitir JWT de curta duracao pelo endpoint de login da API;
- proteger as operacoes administrativas na API com um guard que valida `Authorization: Bearer <token>`;
- manter o JWT em cookie `httpOnly` no BFF/servidor Next.js e encaminha-lo somente em chamadas administrativas;
- deixar leitura publica do catalogo e as rotas do worker sem autenticacao.

## Consequencias

- o bloqueio de `/admin` no frontend melhora a experiencia, mas a autorizacao efetiva permanece no backend;
- o segredo JWT e as credenciais nao podem ter valores de producao versionados; o `.env.example` serve apenas de modelo;
- uma evolucao para varios usuarios, refresh tokens ou papeis devera substituir a comparacao de credenciais por persistencia de usuarios.
