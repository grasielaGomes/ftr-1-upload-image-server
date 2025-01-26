# Configuração do Drizzle ORM

## Destaques

- **Integração com Postgres**: Uso do Drizzle ORM para lidar com o banco de dados.
- **Comparação com Prisma**: Drizzle é mais robusto e simples para queries complexas.
- **Integração com TypeScript**: Drizzle facilita a escrita de queries complexas com TypeScript.
- **Configuração de Schemas**: Definição de esquemas usando TypeScript.
- **Migrations**: Controle de versão do banco de dados com DrizzleKit.
- **Visualização do Banco de Dados**: Uso do Drizzle Studio para gerenciar o banco de dados.

### Passo-a-Passo

1. **Instalar Drizzle e DrizzleKit**

   ```bash
   pnpm add drizzle-orm postgres
   pnpm add drizzle-kit -D
   ```

2. **Criar Arquivo de Configuração do Drizzle**

   ```typescript
   // filepath: drizzle.config.ts
   import { env } from '@/env'
   import type { Config } from 'drizzle-kit'

   export default {
     dbCredentials: {
       url: env.DATABASE_URL,
     },
     dialect: 'postgresql',
     schema: 'src/infra/db/schemas/*',
     out: 'src/infra/db/migrations',
   } satisfies Config
   ```

3. **Estrutura de Pastas**

```plaintext
src/
└── infra/
    └── db/
        ├── schemas/
        └── migrations/
```

4. **Definir Schemas**

   ```typescript
   // filepath: src/infra/db/schemas/uploads.ts
   import { randomUUID } from 'node:crypto'
   import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

   export const uploads = pgTable('uploads', {
     id: text('id')
       .primaryKey()
       .$defaultFn(() => randomUUID()),
     name: text('name').notNull(),
     remoteKey: text('remote_key').notNull().unique(),
     remoteUrl: text('remote_url').notNull(),
     createdAt: timestamp('created_at').defaultNow().notNull(),
   })
   ```

5. **Adicionar Scripts de Comando no `package.json`**

   ```json
   "scripts": {
       "db:generate": "drizzle-kit generate",
       "db:migrate": "drizzle-kit migrate",
       "db:studio": "drizzle-kit studio"
   }
   ```

6. **Rodar Comandos do Drizzle**
   - **Gerar Migrations**
     ```bash
     pnpm run db:generate
     ```
   - **Executar Migrations**
     ```bash
     pnpm run db:migrate
     ```
   - **Visualizar Banco de Dados**
     ```bash
     pnpm run db:studio
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/9ff5f2744083f43b7e73d6f0ac6d62625130e5e7
```
