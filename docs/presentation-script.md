# Roteiro de Apresentacao

## 1. Abertura

- Apresentar o produto como um catalogo com busca semantica e arquitetura explicita.
- Explicar que o foco e portfolio tecnico, nao e-commerce completo.

## 2. Problema

- Busca textual simples nao expressa intencao.
- Catalogos sem estrutura ficam dificeis de explicar e evoluir.

## 3. Solucao

- Mostrar `Next.js` no frontend, `NestJS` na API e `PostgreSQL + pgvector` na base.
- Explicar que o worker prepara a ingestao e a futura indexacao semantica.
- Destacar que a documentacao faz parte da entrega.

## 4. Demo

- Abrir a homepage e mostrar a busca.
- Entrar no painel administrativo.
- Navegar ate um produto e mostrar dados, atributos e contexto.
- Apontar o fluxo de ingestao e a relacao com o endpoint semantico.

## 5. Decisoes tecnicas

- Monorepo com apps independentes.
- Contratos HTTP entre frontend, API e worker.
- `LlamaIndex` como base da camada de retrieval.
- `PostgreSQL + pgvector` para manter a solucao simples e demonstravel.

## 6. Fechamento

- Reforcar que o projeto combina produto, arquitetura e documentacao.
- Encerrar com os proximos passos possiveis: refinamento de acessibilidade, profiling e evolucao da busca.
