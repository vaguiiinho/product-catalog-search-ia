# ADR 0002 - Busca semantica com LlamaIndex

## Status

Aprovado

## Contexto

O catalogo precisa entender intencao do usuario, nao apenas palavras-chave. A solucao deve suportar ingestao, retrieval e uma base para RAG.
Neste projeto, a camada de `LLM` e `RAG` e apresentada como integracao simulada sobre um sistema ja existente, para fins de portfolio e demo.

## Decisao

Usar `LlamaIndex` como base conceitual da camada de busca semantica e RAG.

`LangChain` nao sera parte obrigatoria do MVP e so entrara se houver necessidade real de agente com ferramentas.

## Alternativas consideradas

- usar apenas busca textual tradicional;
- usar `LangChain` como base principal da IA;
- usar uma vector database externa desde o inicio.

## Justificativa

- `LlamaIndex` e mais direto para ingestao e recuperacao de documentos;
- o problema principal aqui e retrieval, nao orquestracao de agente;
- reduzir ferramentas diminui complexidade e acelera a entrega;
- a demo fica mais objetiva e facil de explicar.

## Consequencias

- MVP mais simples e previsivel;
- menor custo cognitivo para manter a solucao;
- possibilidade de adicionar `LangChain` depois, apenas se necessario;
- dependencia da qualidade do schema e dos dados de entrada.
- a demo mostra a arquitetura de `LLM` e `RAG` sem depender de uma integracao externa real no MVP.

## Observacoes

A busca deve ser hibrida: filtros estruturados + similaridade vetorial + ranking final.
