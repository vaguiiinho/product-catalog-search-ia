# OCI Always Free

Este módulo cria somente o necessário para hospedar o `docker-compose`: uma VCN pública, internet gateway, subnet, regras de rede e uma VM Ubuntu ARM `VM.Standard.A1.Flex`.

Os padrões são **2 OCPUs e 12 GB RAM**; confirme a disponibilidade e a cota Always Free da sua tenancy antes de aplicar. Não são criados banco gerenciado, load balancer, NAT gateway, DNS ou recursos pagos. PostgreSQL, API, web, worker e Nginx rodam na mesma VM, em contêineres.

## Aplicar

1. Configure a autenticação do provider OCI (normalmente em `~/.oci/config`) e copie `terraform.tfvars.example` para `terraform.tfvars`.
2. Preencha os OCIDs, a chave SSH pública e um CIDR `/32` para SSH. Escolha uma imagem **Ubuntu ARM64** compatível com A1 na região.
3. Execute:

   ```bash
   terraform -chdir=terraform init
   terraform -chdir=terraform plan
   terraform -chdir=terraform apply
   ```

4. Após o cloud-init terminar, conecte-se como `ubuntu`, clone o repositório em `/opt/product-catalog`, crie os arquivos `.env` a partir dos exemplos e execute `docker compose up -d --build`.

As regras expõem somente 80 e 443 para a web, além de SSH limitado ao CIDR informado. API (3001) e PostgreSQL (5432) não são publicados.

Para HTTPS, aponte um domínio à saída `public_ip` e coloque um terminador TLS (por exemplo, Caddy ou Certbot) na frente do Nginx. Enquanto o acesso for apenas pelo IP público em HTTP, mantenha `SITE_URL=http://IP_DA_VM` e saiba que o login não deve ser tratado como produção.
