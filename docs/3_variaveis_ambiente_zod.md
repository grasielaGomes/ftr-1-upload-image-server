# Configuração de Variáveis de Ambiente com Zod

## Destaques

- **Criação de Arquivos `.env`**:

  - `.env` com `DATABASE_URL`, `PORT` e `NODE_ENV`.
  - `.env.test` para testes com `DATABASE_URL` apontando para `upload_test`.

- **Validação com Zod**:

  - Criação de um arquivo `env.ts` dentro de `src`.
  - Uso do Zod para validar variáveis de ambiente:
    - `PORT` como string convertida para número, com default `3333`.
    - `NODE_ENV` como enum (`development`, `test`, `production`), com default `production`.
    - `DATABASE_URL` como string que deve ser uma URL começando com `postgres`.

- **Exportação das Variáveis**:

  - `export const env = envSchema.parse(process.env)`.

- **Configuração no `package.json`**:

  - Adicionar flag para carregar variáveis de ambiente automaticamente.

- **Verificação**:
  - Adicionar `console.log(env.DATABASE_URL)` no servidor para verificar se as variáveis estão sendo carregadas corretamente.

## Passo-a-Passo

1. **Crie um arquivo `.env`** com as seguintes variáveis:

   ```plaintext
   DATABASE_URL=postgres://docker:docker@localhost:5432/upload
   PORT=3333
   NODE_ENV=development
   ```

2. Crie um arquivo .env.test para testes:

```plaintext
DATABASE_URL=postgres://docker:docker@localhost:5432/upload_test
PORT=3333
NODE_ENV=test
```

3. Crie um arquivo `env.ts` dentro de `src` e adicione o seguinte código:

   ```typescript
   import { z } from 'zod'

   const envSchema = z.object({
     PORT: z.string().transform(Number).default('3333'),
     NODE_ENV: z
       .enum(['development', 'test', 'production'])
       .default('production'),
     DATABASE_URL: z.string().url().startsWith('postgresql://'),
   })

   export const env = envSchema.parse(process.env)
   ```

4. **Verifique se as variáveis de ambiente estão sendo carregadas corretamente**:
   Adicione um `console.log(env.DATABASE_URL)` no seu servidor e execute o projeto.
5. Adicione a flag `--env-file` no script de dev

   ```json
   "scripts": {
     "dev": "tsx watch --env-file .env src/infra/http/server.ts"
   }
   ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/cac7a1245ae7f16dca3f03c666941e766d8008e0
```
