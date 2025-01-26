# Workflow de CI para Testes

## Destaques

- **Configuração de CI**: Configuração de um workflow simples de CI para o GitHub Actions.
- **Execução de Testes**: Execução dos testes configurados no app.
- **Divisão em Pull Requests**: Importância de dividir o trabalho em pull requests.
- **Dependências**: Uso do Postgres como dependência.
- **Cache do Node**: Configuração do cache do Node e PNPM.

### Passo-a-Passo

1.  **Criar Pastas e Arquivos**

    - Crie a pasta `.github/workflows` e dentro dela o arquivo `testes.yml`:
      ```plaintext
      mkdir -p .github/workflows
      touch .github/workflows/testes.yml
      ```

2.  **Copiar Workflow**

    - Copie um workflow simples para o arquivo `testes.yml`:

      ```yaml
      name: Tests
      on:
        pull_request:
          branches:
            - main
          types: [opened, reopened, labeled, unlabeled, synchronize]


        jobs:
        run-ci:
        name: Run Tests
        runs-on: ubuntu-latest

            services:
              postgres:
                image: postgres:13
                ports:
                  - 5432:5432
                env:
                  POSTGRES_USER: docker
                  POSTGRES_PASSWORD: docker
                  POSTGRES_DB: upload_test
                options: >-
                  --health-cmd pg_isready
                  --health-interval 10s
                  --health-timeout 5s
                  --health-retries 5

            steps:
              - uses: actions/checkout@v4

              - uses: pnpm/action-setup@v4
                name: Install pnpm
                with:
                  version: 9
                  run_install: false

              - name: Install Node.js
                uses: actions/setup-node@v4
                with:
                  node-version: 20
                  cache: "pnpm"

              - run: pnpm install --frozen-lockfile
              - run: pnpm run test
      ```

3.  **Criar Pull Request**

    - Crie uma pull request para testar o workflow:
      ```bash
      git add .
      git commit -m "Setup CI workflow"
      git push origin <branch-name>
      gh pr create
      ```

4.  **Verificar Execução**
    - Verifique a execução do workflow no GitHub Actions:
      ```plaintext
      Acesse a aba "Actions" no repositório do GitHub para ver a execução do workflow.
      ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/b3b59026d4be28c2e5f9c09020eded6884285bdf
```
