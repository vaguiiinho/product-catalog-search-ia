# Roteiro de Apresentacao

## 1. Abertura

- Apresentar o produto como um catalogo com busca semantica e arquitetura explicita.
- Explicar que o foco e portfolio tecnico, nao e-commerce completo.
- Dizer que a demo simula a integracao de `LLM`, `RAG` e `pgvector` em um sistema que ja existia, para tornar a narrativa realista sem depender de um servico externo.

## 2. Problema

- Busca textual simples nao expressa intencao.
- Catalogos sem estrutura ficam dificeis de explicar e evoluir.

## 3. Solucao

- Mostrar `Next.js` no frontend, `NestJS` na API e `PostgreSQL + pgvector` na base.
- Explicar que o worker prepara a ingestao e a indexacao semantica, enquanto a camada de RAG recomendada para o repo e `LangChain` + `Groq`.
- Destacar que a documentacao faz parte da entrega.

## 4. Demo

- Abrir a homepage e mostrar a busca.
- Entrar no painel administrativo.
- Navegar ate um produto e mostrar dados, atributos e contexto.
- Mostrar que o worker gera embeddings, consolida o documento semantico e grava os vetores em `pgvector`.
- Apontar o fluxo de ingestao e a relacao com o endpoint semantico.
- Reforcar que `LangChain` + `Groq` e a combinacao recomendada para a camada de `LLM` e `RAG` sobre a base existente.

## 5. Decisoes tecnicas

- Monorepo com apps independentes.
- Contratos HTTP entre frontend, API e worker.
- `LangChain` + `Groq` como escolha pratica para a camada de retrieval e respostas assistidas.
- `PostgreSQL + pgvector` para manter a solucao simples e demonstravel.

## 6. Fechamento

- Reforcar que o projeto combina produto, arquitetura e documentacao.
- Encerrar com os proximos passos possiveis: refinamento de acessibilidade, profiling e evolucao da busca.
