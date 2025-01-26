# Estratégias de IDs Únicos

## Destaques

### IDs

- **Auto-Increment**:
  - Vantagens: Nunca se repete, ordenável, ocupa poucos bytes.
  - Desvantagens: Não pode ser usado para entidades públicas.
- **UUID**:
  - Vantagens: Pode ser público.
  - Desvantagens: Não ordenável até UUID v6, grande, ocupa mais espaço.
- **Snowflake ID**:
  - Algoritmo com baixa chance de conflito, usado por Twitter, Discord, Instagram.
  - Time sortable: IDs ordenáveis por tempo.
- **LEAD**: Algoritmo de geração de IDs que são menores e ordenáveis.
- **UUID v7**:
  - IDs ordenáveis e menores que UUIDs tradicionais.

### Paginação

- **Cursor-Based Pagination**: Técnica de paginação onde os resultados são divididos em páginas utilizando um cursor que aponta para uma posição específica no conjunto de dados. Em vez de usar um deslocamento fixo, como na paginação baseada em offset, a paginação baseada em cursor utiliza um identificador único (cursor) para marcar a posição atual e recuperar o próximo conjunto de resultados a partir desse ponto. Essa abordagem é mais eficiente para grandes conjuntos de dados e evita problemas de desempenho e inconsistência que podem ocorrer com a paginação baseada em offset. Utilizada para scrolls infinitos.
- **Offset-Based Pagination**: Técnica de paginação onde os resultados são divididos em páginas com base em um deslocamento (offset) e um limite (limit). O offset indica o número de registros a serem ignorados antes de começar a retornar os resultados, enquanto o limit define o número máximo de registros a serem retornados. Essa abordagem é comum em APIs e consultas de banco de dados para paginar grandes conjuntos de dados de forma eficiente.

### Passo-a-Passo

1. **Implementar UUID v7**

   ```bash
   pnpm add uuidv7
   ```

   - Configurar UUID v7 no projeto:

     ```typescript
     // filepath: src/infra/db/schemas/uploads.ts
     import { uuidv7 } from 'uuidv7'

     .$defaultFn(() => uuidv7()),
     ```

2. **Criar um barrel file para exportar todos os squemas**

   ```typescript
   // filepath: src/infra/db/schemas/index.ts
   import { uploads } from './uploads'

   export const schema = {
     uploads,
   }
   ```

3. **Criar instâncias drizzle e postgres**

   ```typescript
   // filepath: src/infra/db/index.ts
   import { env } from '@/env'
   import { drizzle } from 'drizzle-orm/postgres-js'
   import postgres from 'postgres'
   import { schema } from './schemas'

   export const pg = postgres(env.DATABASE_URL)
   export const db = drizzle(pg, { schema })
   ```

4. **Testar Implementação**
   - Criar um registro no banco de dados e verificar a geração de IDs únicos e ordenáveis.

```typescript
// filepath: src/infra/http/routes/upload-image.ts

import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
...
async (request, reply) => {
      await db.insert(schema.uploads).values({
        name: 'test.jpg',
        remoteKey: 'test.jpg',
        remoteUrl: 'http://asdasd.com',
      })

      return reply.status(201).send({ uploadId: '123' })
    }

  return reply.status(201).send({ uploadId: '123' })
...
```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/276ef8f300a1b82c0ac88607cce5733d36fc98bd
```
