# ADR 0004 - Orquestracao de agentes por responsabilidade

## Status

Aprovado

## Contexto

O projeto precisa manter coerencia entre arquitetura, implementacao e documentacao. Para isso, diferentes partes do sistema devem ser tratadas por agentes especializados, mas coordenados por um agente de arquitetura.

## Decisao

Adotar a seguinte orquestracao:

- `architect` coordena decisoes de alto nivel;
- `backend` define dominio, casos de uso e limites de camadas;
- `nestjs-backend` implementa a API REST, Prisma e testes;
- `nextjs-frontend` implementa a experiencia em Next.js;
- `ingestion-worker` cuida de ingestao, normalizacao e reindexacao;
- `ai-rag` cuida de retrieval semantico e orquestracao de IA;
- `data-vector-store` cuida do schema, indices e vetores;
- `documentation` produz PRD, ADRs e checklist.

## Alternativas consideradas

- centralizar todo trabalho em um unico agente;
- criar agentes sem responsabilidade clara;
- deixar a documentacao separada da decisao tecnica.

## Justificativa

- separa responsabilidades por dominio tecnico;
- reduz retrabalho e sobreposicao de contexto;
- facilita a revisao de decisoes;
- melhora a qualidade da documentacao e da implementacao.

## Consequencias

- exige disciplina para escolher o agente certo;
- melhora a clareza do fluxo de trabalho;
- cria uma base reutilizavel para evolucao do projeto;
- torna a arquitetura de trabalho tao explicita quanto a arquitetura do sistema.

## Observacoes

O arquivo `.agents/README.md` e o ponto de entrada dessa orquestracao.

