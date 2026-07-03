# ADR 0006 - Estrategia de ingestao do catalogo

## Status

Aprovado

## Contexto

A fase de busca semantica precisa de um pipeline previsivel para transformar o catalogo em documentos prontos para indexacao vetorial e reindexacao futura.
Como o objetivo do projeto e demonstrar a integracao em um sistema ja existente, a estrategia privilegia um fluxo interno e observavel, em vez de depender de um provedor externo real no MVP.

## Decisao

Adotar uma estrategia de ingestao em camadas:

- `API` como fonte operacional do catalogo;
- `worker` como orquestrador de ingestao e reindexacao;
- normalizacao do produto antes de qualquer etapa semantica;
- producao de um documento semantico por produto, com texto consolidado para embeddings posteriores;
- reindexacao incremental quando possivel, mantendo uma trilha clara para o MVP.
- representar a camada de `LLM`/`RAG` com embeddings deterministicos e persistencia em `pgvector`, para a demo ficar coesa.

## Alternativas consideradas

- gerar embeddings diretamente no frontend ou na API;
- fazer o worker ler o banco sem contrato intermediario;
- depender de uma pipeline externa desde o primeiro passo.

## Justificativa

- o contrato HTTP da API ja existe e simplifica a coleta de dados;
- o worker fica desacoplado do runtime da API;
- a normalizacao antes da indexacao reduz ruido no conteudo vetorial;
- o desenho prepara a transicao para a camada de RAG do projeto, hoje prevista com `LangChain` + `Groq`, sem forcar a etapa de embeddings agora.

## Consequencias

- o worker passa a ser um componente real do sistema;
- a estrategia fica explicita e documentada;
- a indexacao futura pode ser incremental sem redesenhar a coleta;
- a busca semantica depende de dados mais ricos e consistentes.

## Observacoes

O MVP implementa a preparacao de documentos de ingestao; a geracao de embeddings deterministicos e a persistencia vetorial ja fazem parte da demo, enquanto a integracao com LLM externo continua fora do escopo.
