# ADR 0005 - Monorepo com apps independentes

## Status

Aprovado

## Contexto

O projeto e de portfolio, mas precisa parecer consistente com um deploy futuro onde frontend, backend e worker podem estar em ambientes diferentes.

## Decisao

Adotar um monorepo com apps independentes:

- `apps/web` para o frontend;
- `apps/api` para o backend;
- `apps/worker` para processamento em background;
- `packages/shared` apenas para utilitarios ou contratos puros, quando necessario.

Cada app tera suas dependencias, scripts e ciclo de build/producao proprios.

## Alternativas consideradas

- repositorios separados desde o inicio;
- um unico app monolitico;
- compartilhar runtime e codigo de execucao entre apps.

## Justificativa

- preserva a separacao arquitetural sem aumentar demais a carga operacional;
- facilita entender e demonstrar deploy independente no futuro;
- permite evoluir cada app de forma isolada;
- reduz acoplamento entre frontend, backend e worker.

## Consequencias

- mais arquivos de configuracao;
- mais scripts por app;
- necessidade de contratos claros entre servicos;
- organizacao melhor para crescer sem virar monolito acoplado.

## Observacoes

O root do repositorio fica responsavel apenas por workspace, tooling comum e scripts de orquestracao.
