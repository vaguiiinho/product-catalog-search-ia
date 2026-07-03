# Revisao de Arquitetura

## Objetivo

Consolidar o desenho atual do produto para portfolio e deixar explicito o que ja esta implementado, o que foi adiado e como as partes se relacionam.

## Resumo do desenho tecnico

- `Next.js` atende a experiencia publica e o painel administrativo.
- `NestJS` concentra CRUD, contratos e regras de catalogo.
- `apps/worker` prepara documentos de ingestao, embeddings simulados e reindexacao.
- `PostgreSQL + pgvector` permanece como destino natural para persistencia e busca vetorial.
- `LlamaIndex` ou `LangChain` representam a camada de orquestracao de `LLM` e `RAG`.
- a demo representa `LLM` e `RAG` de forma simulada sobre um sistema ja existente, sem acoplar o MVP a um provedor externo.

## Diagrama

O diagrama C4 principal fica em [c4-diagram.puml](../c4-diagram.puml) e cobre:

- contexto do sistema;
- containers principais;
- integracoes externas com storage e LLM;
- separacao entre frontend, API, worker e banco.

## Decisoes consolidadas

- manter monorepo com apps independentes;
- evitar compartilhar runtime entre frontend, API e worker;
- deixar contratos HTTP explicitos entre camadas;
- priorizar simplicidade operacional para demo e entrevista;
- tratar a busca semantica como extensao da base de catalogo, nao como sistema isolado.
- manter a camada de IA como representacao arquitetural no MVP, com comportamento observavel via embeddings locais e `pgvector`.

## Riscos e mitigacoes

- Risco: excesso de documentacao sem ganho pratico.
- Mitigacao: manter os documentos curtos e ligados a decisoes reais do codigo.
- Risco: diagramas ficarem desatualizados.
- Mitigacao: referenciar o C4 como artefato principal e atualizar junto com a checklist.
- Risco: a demo parecer abstrata demais.
- Mitigacao: manter seed real, cards visiveis e roteiro de apresentacao objetivo.

## Validacao

- o frontend carrega catalogo e estados vazios;
- a API expoe CRUD e indice semantico;
- o worker executa um fluxo claro de ingestao;
- a documentacao aponta para a arquitetura real do repositorio.
