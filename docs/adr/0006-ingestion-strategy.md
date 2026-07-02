# ADR 0006 - Estrategia de ingestao do catalogo

## Status

Aprovado

## Contexto

A fase de busca semantica precisa de um pipeline previsivel para transformar o catalogo em documentos prontos para indexacao vetorial e reindexacao futura.

## Decisao

Adotar uma estrategia de ingestao em camadas:

- `API` como fonte operacional do catalogo;
- `worker` como orquestrador de ingestao e reindexacao;
- normalizacao do produto antes de qualquer etapa semantica;
- producao de um documento semantico por produto, com texto consolidado para embeddings posteriores;
- reindexacao incremental quando possivel, mantendo uma trilha clara para o MVP.

## Alternativas consideradas

- gerar embeddings diretamente no frontend ou na API;
- fazer o worker ler o banco sem contrato intermediario;
- depender de uma pipeline externa desde o primeiro passo.

## Justificativa

- o contrato HTTP da API já existe e simplifica a coleta de dados;
- o worker fica desacoplado do runtime da API;
- a normalizacao antes da indexacao reduz ruído no conteúdo vetorial;
- o desenho prepara a transição para `LlamaIndex` sem forçar a etapa de embeddings agora.

## Consequencias

- o worker passa a ser um componente real do sistema;
- a estratégia fica explícita e documentada;
- a indexacao futura pode ser incremental sem redesenhar a coleta;
- a busca semântica depende de dados mais ricos e consistentes.

## Observacoes

O MVP implementa a preparação de documentos de ingestao; a geração de embeddings e a persistência vetorial continuam para a próxima etapa.
