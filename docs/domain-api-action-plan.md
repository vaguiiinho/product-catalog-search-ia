# Plano de melhoria do domínio e da API

## Objetivo

Fortalecer o catálogo com entidades válidas por construção, UUID v4, contratos explícitos
nos casos de uso e testes proporcionais a cada camada.

## Plano de ação

1. Reduzir o título principal sem alterar a hierarquia visual da página.
2. Introduzir objetos de valor para ID, texto obrigatório, slug, preço e URL HTTPS.
3. Reconstruir entidades pelas fábricas do domínio também nas leituras do Prisma.
4. Migrar IDs legados e defaults do banco de cuid para UUID v4.
5. Declarar entradas e saídas dos casos de uso e impedir dependências diretas da
   aplicação sobre infraestrutura ou apresentação.
6. Testar entidades e casos de uso com testes unitários e repositórios com
   PostgreSQL/pgvector real via Testcontainers.
7. Validar testes, lint e builds de API e frontend.

## Checklist de implementação

- [x] fonte responsiva do título reduzida;
- [x] entidades Product, Category, ProductAttribute e ProductImage validadas;
- [x] UUID v4 gerado e validado no domínio;
- [x] objetos de valor para regras recorrentes;
- [x] migration preservando referências de IDs legados;
- [x] repositórios Prisma reconstruindo entidades válidas;
- [x] entradas e saídas explícitas nos casos de uso;
- [x] portas para assistente e índice semântico;
- [x] erros de domínio convertidos em HTTP 400;
- [x] testes unitários de entidades;
- [x] testes unitários de todos os grupos de casos de uso;
- [x] testes de integração dos repositórios com Testcontainers;
- [x] execução local mantida com Node/pnpm e execução Docker mantida com Compose.

## Decisões sobre camadas

- catalog precisa de domínio, aplicação, infraestrutura e apresentação, pois possui
  regras, persistência e integrações.
- auth permanece sem repositório/entidade enquanto o admin for configurado por
  variáveis de ambiente; criar essas camadas agora não adicionaria regra de negócio.
- health permanece somente na apresentação por ser um endpoint técnico sem estado.
- casos de uso usam mocks; repositórios usam Testcontainers. Essa divisão mantém os
  testes de regra rápidos e verifica Prisma, migrations e PostgreSQL de verdade.

## Migração de volumes existentes

A migration de UUID altera chaves primárias e preserva as relações por cascade. Em um
volume Docker já populado, ela deve ser aplicada em uma janela controlada, após backup.
O bootstrap não executa automaticamente essa alteração destrutiva em banco legado.
Bancos novos recebem todas as migrations normalmente por prisma migrate deploy.
