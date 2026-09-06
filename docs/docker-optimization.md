# Docker Optimization

## Estado anterior

Monorepo pnpm 9 com Web Next.js, API NestJS/Prisma/LangChain, worker de indexação one-shot, PostgreSQL+pgvector e Nginx. Os três runtimes copiavam o `node_modules` do monorepo inteiro. Baseline: Web 1,62 GB, API 1,58 GB e Worker 1,53 GB.

## Problemas encontrados

- 909 pacotes eram instalados e transportados para todos os runtimes. Impacto crítico em disco/build/deploy; risco alto.
- Web sem standalone; todos os runtimes Node como root. Impacto de disco/segurança; risco médio.
- Sem limites ou rotação. Impacto em estabilidade/disco; risco baixo.
- O worker não tinha restart/healthcheck, mas o código prova que ele executa uma indexação e encerra. Adicionar restart causaria loop; comportamento foi preservado.
- `cpu-features` e `ssh2`, transitivos do conjunto de build/testes, tentam bindings opcionais e usam fallback JS. Impacto em ruído/tempo e risco ARM64, sem falha de build.
- Seed já era manual; não foi colocado no startup.

## Alterações realizadas

- `pnpm deploy --filter ... --prod` gera árvores isoladas para API e worker.
- Prisma CLI passou a dependência produtiva da API porque `docker-bootstrap.js` o executa.
- Prisma Client é regenerado dentro do diretório implantado.
- Web standalone; três runtimes como `node`; limites/logging/contexto ajustados.

## Dockerfiles

API preserva `docker-bootstrap`, migrations, schema, seed compilado e dependências de IA usadas em produção. Worker recebeu somente três pacotes diretos/transitivos no deploy. Web usa tracing standalone. Histórico final: 19 layers Web, 22 API e 17 Worker.

## Docker Compose

Cinco serviços. API, Web, Postgres e Nginx são contínuos e têm restart. Worker permanece one-shot sem restart. Apenas Nginx publica a porta 81.

## CPU e memória

| Container | RAM observada | Limite RAM | CPU limite | Heap Node |
| --- | ---: | ---: | ---: | ---: |
| Web | 40,9 MiB idle | 320 MiB | 0,50 | 224 MiB |
| API | 49,7 MiB idle | 320 MiB | 0,75 | 224 MiB |
| Worker | encerrou após indexar 0 itens | 256 MiB | 0,50 | 160 MiB |
| Postgres | 38,0 MiB idle | 350 MiB | 0,75 | n/a |
| Nginx | 7,4 MiB idle | 64 MiB | 0,25 | n/a |

## Next.js

Standalone foi habilitado e validado. A imagem inclui somente os arquivos rastreados, static e healthcheck.

## Node/NestJS

API e worker não carregam TypeScript, Jest, ESLint, Testcontainers ou dependências dos outros apps. Dependências LangChain/Groq foram mantidas porque são usadas pela aplicação.

## Prisma

O bootstrap detectou banco vazio e aplicou três migrations com sucesso. A lógica especial para bancos legados foi preservada. Seed permanece manual e o artefato compilado continua disponível.

## Workers

O worker buscou o catálogo, persistiu o índice vazio e terminou com exit 0. Não há restart policy nem healthcheck contínuo por design.

## Logs

Todos os serviços, inclusive o one-shot, usam `json-file`, 10 MB e três arquivos.

## Healthchecks

Postgres, API e Web ficaram saudáveis; Nginx roteou `/` e `/api/health`. O worker teve sucesso verificado por exit code e logs.

## Segurança

Todos os runtimes Node usam `node`; API/Postgres/Worker/Web não publicam portas; secrets e artefatos locais são ignorados.

## ARM64

Status: **PARCIAL**. Node 22 Alpine, pgvector e Nginx possuem manifests arm64; Sharp inclui linuxmusl-arm64 e Prisma gera engine por plataforma. O build completo ainda tenta bindings opcionais de `cpu-features`/`ssh2`, embora haja fallback JS; é obrigatório um build nativo arm64 e smoke de Prisma/Sharp/IA antes de t4g.

## Imagens

| Serviço | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Web | 1,62 GB | 372 MB | 77,0% |
| API | 1,58 GB | 713 MB | 54,9% |
| Worker | 1,53 GB | 245 MB | 84,0% |

Conteúdo OCI final: Web 88,7 MB, API 165,4 MB e Worker 58,8 MB.

## Resultado do build

Compose config, três builds, bootstrap/migrations, startup, healthchecks, HTTP, logs e saída do worker passaram. Sem OOM/restart.

## Pontos pendentes

- Medir worker com catálogo populado e chamadas reais de IA.
- Corrigir o warning CSS de `start` para `flex-start` fora deste escopo.
- Investigar atualização que elimine tentativas de bindings opcionais no estágio de build.
- Executar build ARM64 nativo.
