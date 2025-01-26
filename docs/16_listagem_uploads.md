# Listagem de Uploads

Nesta aula, vamos desenvolver a função getUploads, que lista os uploads. Começamos adaptando a estrutura da função uploadImage, removendo validações desnecessárias e adicionando variáveis para filtros e paginação. Discutimos a importância de usar enums para evitar entradas inválidas e como implementar a paginação baseada em offset. Também abordamos a ordenação dos uploads e a contagem total de registros, garantindo que o front-end receba as informações necessárias para a navegação. Por fim, falamos sobre a tipagem de saída e a escolha entre TypeScript e Zod.

## Destaques

- **Função getUploads**: Criação da função para listar uploads.
- **Filtros e Paginação**: Implementação de filtros e paginação.
- **Ordenação**: Ordenação dos resultados por campos específicos.
- **Offset-based Pagination**: Paginação baseada em offset.
- **Insensitive Like**: Filtro de busca insensível a maiúsculas e minúsculas.
- **Total de Registros**: Cálculo do total de registros para paginação.

### Passo-a-Passo

1. **Criar Função getUploads**

   - Crie a função `getUploads` baseada na estrutura da função `uploadImage`.

```typescript
// filepath: src/app/services/get-uploads.ts
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { asc, count, desc, ilike } from 'drizzle-orm'
import { z } from 'zod'

// Definição do esquema de validação para os dados de entrada
const getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

// Tipo derivado do esquema de validação
type GetUploadsInput = z.input<typeof getUploadsInput>

// Tipo para a saída da função
type GetUploadsOutput = {
  uploads: {
    id: string
    name: string
    remoteKey: string
    remoteUrl: string
    createdAt: Date
  }[]
  total: number
}

// Função para obter a lista de uploads
export async function getUploads(
  input: GetUploadsInput
): Promise<Either<never, GetUploadsOutput>> {
  // Validação dos dados de entrada
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getUploadsInput.parse(input)

  // Consulta ao banco de dados para obter os uploads e o total de uploads
  const [uploads, [{ total }]] = await Promise.all([
    // Consulta para obter os uploads
    db
      .select({
        id: schema.uploads.id,
        name: schema.uploads.name,
        remoteKey: schema.uploads.remoteKey,
        remoteUrl: schema.uploads.remoteUrl,
        createdAt: schema.uploads.createdAt,
      })
      .from(schema.uploads)
      // Filtro de busca, se fornecido
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      )
      // Ordenação dos resultados
      .orderBy((fields) => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      // Paginação dos resultados
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    // Consulta para obter o total de uploads
    db
      .select({ total: count(schema.uploads.id) })
      .from(schema.uploads)
      // Filtro de busca, se fornecido
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      ),
  ])

  // Retorno dos uploads e do total de uploads
  return makeRight({ uploads, total })
}
```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/9e3a95b51ebf02e079c59e0e686e07c49bf54599
```
