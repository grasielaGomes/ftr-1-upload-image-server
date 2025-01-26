# Testes para Listagem de Uploads

## Destaques

- **Função getUploads**: Criação de testes para a função de listagem de uploads.
- **Factory Pattern**: Uso do Factory Pattern para criar dados de teste.
- **Validação de Uploads**: Validação de que os uploads são retornados corretamente.
- **Paginação**: Testes para verificar a paginação dos uploads.
- **Ordenação**: Testes para verificar a ordenação dos uploads.

### Passo-a-Passo

1. **Criar Arquivo de Teste**

   - Crie o arquivo `getUploadsSpec` baseado no `uploadImageSpec`.

2. **Instalar dependências**

   - Instale `faker` e `dayjs`.

   ```bash
   pnpm add dayjs @faker-js/faker -D
   ```

3. **Criar Factory para Dados de Teste**

   - Crie uma função assíncrona `makeUpload` para gerar dados de teste:

     ```typescript
     // filepath: src/test/factories/make-upload.ts
     import { db } from '@/infra/db'
     import { schema } from '@/infra/db/schemas'
     import { fakerPT_BR as faker } from '@faker-js/faker'
     import type { InferInsertModel } from 'drizzle-orm'

     export async function makeUpload(
       overrides?: Partial<InferInsertModel<typeof schema.uploads>>
     ) {
       const fileName = faker.system.fileName()

       const result = await db
         .insert(schema.uploads)
         .values({
           name: fileName,
           remoteKey: `images/${fileName}`,
           remoteUrl: `http://example.com/images/${fileName}`,
           ...overrides,
         })
         .returning()

       return result[0]
     }
     ```

4. **Configurar Função de Teste**

   - Configure a função de teste `get uploads`:

     ```typescript
     // filepath: src/app/services/get-uploads.spec.ts
     describe('get uploads', () => {
       it('should be able to get the uploads', async () => {
         const namePattern = randomUUID()

         const upload1 = await makeUpload({ name: `${namePattern}.wep` })
         const upload2 = await makeUpload({ name: `${namePattern}.wep` })
         const upload3 = await makeUpload({ name: `${namePattern}.wep` })
         const upload4 = await makeUpload({ name: `${namePattern}.wep` })
         const upload5 = await makeUpload({ name: `${namePattern}.wep` })

         const sut = await getUploads({
           searchQuery: namePattern,
         })

         expect(isRight(sut)).toBe(true)
         expect(unwrapEither(sut).total).toEqual(5)
         expect(unwrapEither(sut).uploads).toEqual([
           expect.objectContaining({ id: upload5.id }),
           expect.objectContaining({ id: upload4.id }),
           expect.objectContaining({ id: upload3.id }),
           expect.objectContaining({ id: upload2.id }),
           expect.objectContaining({ id: upload1.id }),
         ])
       })
     })
     ```

5. **Testar Paginação**

   - Crie testes para verificar a paginação dos uploads:

     ```typescript
     it('should be able to get paginated uploads', async () => {
       const namePattern = randomUUID()

       const upload1 = await makeUpload({ name: `${namePattern}.wep` })
       const upload2 = await makeUpload({ name: `${namePattern}.wep` })
       const upload3 = await makeUpload({ name: `${namePattern}.wep` })
       const upload4 = await makeUpload({ name: `${namePattern}.wep` })
       const upload5 = await makeUpload({ name: `${namePattern}.wep` })

       let sut = await getUploads({
         searchQuery: namePattern,
         page: 1,
         pageSize: 3,
       })

       expect(isRight(sut)).toBe(true)
       expect(unwrapEither(sut).total).toEqual(5)
       expect(unwrapEither(sut).uploads).toEqual([
         expect.objectContaining({ id: upload5.id }),
         expect.objectContaining({ id: upload4.id }),
         expect.objectContaining({ id: upload3.id }),
       ])

       sut = await getUploads({
         searchQuery: namePattern,
         page: 2,
         pageSize: 3,
       })

       expect(isRight(sut)).toBe(true)
       expect(unwrapEither(sut).total).toEqual(5)
       expect(unwrapEither(sut).uploads).toEqual([
         expect.objectContaining({ id: upload2.id }),
         expect.objectContaining({ id: upload1.id }),
       ])
     })
     ```

6. **Testar Ordenação**

   - Crie testes para verificar a ordenação dos uploads:

     ```typescript
     it('should be able to get sorted uploads', async () => {
       const namePattern = randomUUID()

       const upload1 = await makeUpload({
         name: `${namePattern}.wep`,
         createdAt: new Date(),
       })

       const upload2 = await makeUpload({
         name: `${namePattern}.wep`,
         createdAt: dayjs().subtract(1, 'day').toDate(),
       })

       const upload3 = await makeUpload({
         name: `${namePattern}.wep`,
         createdAt: dayjs().subtract(2, 'day').toDate(),
       })

       const upload4 = await makeUpload({
         name: `${namePattern}.wep`,
         createdAt: dayjs().subtract(3, 'day').toDate(),
       })

       const upload5 = await makeUpload({
         name: `${namePattern}.wep`,
         createdAt: dayjs().subtract(4, 'day').toDate(),
       })

       let sut = await getUploads({
         searchQuery: namePattern,
         sortBy: 'createdAt',
         sortDirection: 'desc',
       })

       expect(isRight(sut)).toBe(true)
       expect(unwrapEither(sut).total).toEqual(5)
       expect(unwrapEither(sut).uploads).toEqual([
         expect.objectContaining({ id: upload1.id }),
         expect.objectContaining({ id: upload2.id }),
         expect.objectContaining({ id: upload3.id }),
         expect.objectContaining({ id: upload4.id }),
         expect.objectContaining({ id: upload5.id }),
       ])

       sut = await getUploads({
         searchQuery: namePattern,
         sortBy: 'createdAt',
         sortDirection: 'asc',
       })

       expect(isRight(sut)).toBe(true)
       expect(unwrapEither(sut).total).toEqual(5)
       expect(unwrapEither(sut).uploads).toEqual([
         expect.objectContaining({ id: upload5.id }),
         expect.objectContaining({ id: upload4.id }),
         expect.objectContaining({ id: upload3.id }),
         expect.objectContaining({ id: upload2.id }),
         expect.objectContaining({ id: upload1.id }),
       ])
     })
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/9e3a95b51ebf02e079c59e0e686e07c49bf54599
```
