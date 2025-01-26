# Configuração do Postgres com Docker

## Destaques

- **Banco de Dados**: Uso do Postgres como banco de dados.
- **Docker Compose**: Subida do Postgres utilizando Docker Compose.
- **Pré-requisito**: Docker instalado na máquina.
- **Configuração Simples**: Criação de um único service chamado `pg` (nome personalizável).
- **Imagem Bitnami**: Preferência pela imagem Bitnami do Postgres (usuário e senha como `docker`).
- **Banco de Dados**: Criação do banco de dados `upload`.
- **Estrutura de Pastas**: Criação de uma pasta `docker` no VS Code.
- **Script de Inicialização**: Criação de um script `init.sql` para criar o banco de dados `upload` e um banco de teste.
- **Volumes do Docker**: Apontar a pasta `docker` para `docker-entrypoint-initdb.d`.
- **Execução de Scripts**: Todos os arquivos SQL na pasta `docker` serão executados ao subir o container.
- **Comandos Docker**:
  - Parar containers existentes: `docker stop`.
  - Subir containers: `docker compose up -d`.
- **Verificação**: Confirmar que o Docker está pronto para aceitar conexões.

## Passo-a-Passo

1. **Instale o Docker** na sua máquina.

2. **Crie um arquivo `docker-compose.yml`** com a configuração do Postgres:

   - Use a imagem da Bitnami.
   - Configure o usuário e senha como `docker`.
   - Crie um banco de dados chamado `upload`.

   Veja um exemplo na pasta `Exemplos`.

3. **Crie uma pasta chamada `docker`** dentro do seu projeto no VS Code.

4. **Dentro da pasta `docker`, crie um script chamado `init.sql`** para criar o banco de dados `upload` e um banco de teste.

```sql
CREATE DATABASE upload_test;
```

5. **Configure volumes no Docker** para apontar a pasta `docker` para `docker-entrypoint-initdb.d`.

6. **Coloque todos os scripts SQL necessários** dentro da pasta `docker`.

7. **Pare quaisquer containers do Docker** que estejam rodando com `docker stop`.

8. **Inicie o Docker Compose** com `docker compose up -d`.

9. **Verifique se o Docker está rodando** e pronto para aceitar conexões.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/02b6f06c158c8297810fd52fc701ea0dc5dfb5a1
```
