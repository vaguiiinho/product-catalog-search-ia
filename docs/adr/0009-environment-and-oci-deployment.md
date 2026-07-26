# ADR 0009: configuração por aplicação e deploy em OCI Always Free

## Contexto

O repositório concentrava credenciais do banco, Groq, URLs e autenticação em um `.env` raiz. Isso misturava responsabilidades e fazia as URLs variarem entre navegador, host e rede Docker.

## Decisão

- `apps/api/.env` contém somente configurações da API: banco, Groq, administrador, JWT e CORS de desenvolvimento.
- `apps/web/.env` e `apps/worker/.env` contêm somente `API_URL`; o web também define `SITE_URL` para metadata.
- `deploy/.env` contém apenas as três variáveis que inicializam o PostgreSQL do Compose.
- No Compose, a URL interna é sempre `http://api:3001`; o navegador usa o mesmo origin e chega à API por `/api` via Nginx. CORS só é habilitado quando `CORS_ORIGIN` é definido para desenvolvimento direto.
- Terraform provisiona uma única VM ARM A1, rede pública e regras mínimas na OCI. Os serviços permanecem em Docker na VM, sem banco ou balanceador gerenciado.

## Consequências

As credenciais não entram em exemplos versionados, API e banco não ficam expostos, e as URLs não dependem do hostname Docker no browser. O deploy inicial por IP funciona em HTTP; um domínio e TLS continuam necessários para uma publicação de produção segura.
