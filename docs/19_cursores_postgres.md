# Cursores no Postgres

## Destaques

- **Exportação de Uploads**: Implementação da funcionalidade de exportação de uploads.
- **Uso de Cursores**: Utilização de cursores para lidar com grandes volumes de dados.
- **Streams do Node.js**: Uso de streams do Node.js para escrita incremental de CSV.
- **Armazenamento no Cloudflare R2**: Salvamento dos arquivos exportados no Cloudflare R2.

### Passo-a-Passo

1. **Criar Função de Exportação**

   - Crie a função `exportUploads` baseada na função `getUploads`:

     ```typescript
     // filepath: src/app/services/export-uploads.ts
     import { db, pg } from '@/infra/db'
     import { schema } from '@/infra/db/schemas'
     import { type Either, makeRight } from '@/infra/shared/either'
     import { asc, count, desc, ilike } from 'drizzle-orm'
     import { z } from 'zod'

     // Definição do esquema de validação para os dados de entrada
     const exportUploadsInput = z.object({
       searchQuery: z.string().optional(),
     })

     // Tipo derivado do esquema de validação
     type ExportUploadsInput = z.input<typeof exportUploadsInput>

     // Tipo para a saída da função
     type ExportUploadsOutput = {
       reportUrl: string
     }

     // Função para exportar uploads
     export async function exportUploads(
       input: ExportUploadsInput
     ): Promise<Either<never, ExportUploadsOutput>> {
       // Validação dos dados de entrada
       const { searchQuery } = exportUploadsInput.parse(input)

       // Construção da consulta SQL com base nos filtros fornecidos
       const { sql, params } = db
         .select({
           id: schema.uploads.id,
           name: schema.uploads.name,
           remoteUrl: schema.uploads.remoteUrl,
           createdAt: schema.uploads.createdAt,
         })
         .from(schema.uploads)
         .where(
           searchQuery
             ? ilike(schema.uploads.name, `%${searchQuery}%`)
             : undefined
         )
         .toSQL()

       // Criação de um cursor para iterar sobre os resultados da consulta
       const cursor = pg.unsafe(sql, params as string[]).cursor(2)

       // Inicialização de uma variável para armazenar o CSV
       const csv = ''

       // Iteração sobre os resultados da consulta usando o cursor
       for await (const rows of cursor) {
         console.log(rows)
         // Aqui você pode processar cada linha e adicionar ao CSV
       }

       // Retorno da URL do relatório (a ser implementado)
       return makeRight({ reportUrl: '' })
     }
     ```

#### O que é o Cursor do PostgreSQL?

Um **cursor** no PostgreSQL é um mecanismo que permite iterar sobre os resultados de uma consulta de forma eficiente. Em vez de carregar todos os resultados de uma vez na memória, o cursor permite processar os resultados linha por linha ou em pequenos blocos. Isso é especialmente útil para consultas que retornam um grande número de registros, pois ajuda a reduzir o uso de memória e melhora o desempenho.

#### Vantagens do Uso de Cursores

- **Eficiência de Memória**: Permite processar grandes conjuntos de dados sem carregar tudo na memória de uma vez.
- **Melhor Desempenho**: Reduz a carga no servidor e no cliente, permitindo um processamento mais eficiente dos resultados.
- **Controle Fino**: Oferece controle sobre como os dados são recuperados e processados, permitindo pausas e retomadas na iteração dos resultados.

2. **Adicionar teste da rota**

   - Escreva um teste para ver o funcionamento do cursor pelo console:

     ```typescript
     // filepath: src/app/services/export-uploads.spec.ts
     describe('export uploads', () => {
       it('should be able to export uploads', async () => {
         const namePattern = randomUUID()

         const upload1 = await makeUpload({ name: `${namePattern}.wep` })
         const upload2 = await makeUpload({ name: `${namePattern}.wep` })
         const upload3 = await makeUpload({ name: `${namePattern}.wep` })
         const upload4 = await makeUpload({ name: `${namePattern}.wep` })
         const upload5 = await makeUpload({ name: `${namePattern}.wep` })

         const sut = await exportUploads({
           searchQuery: namePattern,
         })
       })
     })
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/9f42568fb93e2ae33396cfd8b81d16ffdfcdc6f7
```
