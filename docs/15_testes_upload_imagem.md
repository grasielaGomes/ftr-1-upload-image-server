# Testes para Upload de Imagem

## Destaques

- **Tipos de Testes**: Unitário, end-to-end e integração.
- **Mocks**: Uso de mocks para banco de dados e Cloudflare R2.
- **Testes End-to-End**: Testar rota HTTP, verificar upload no R2 e banco de dados.
- **Testes de Integração**: Testar função de upload e banco de dados.
- **Testes de Erro**: Verificar comportamento com arquivos inválidos.

### Passo-a-Passo

1. **Configurar Testes Unitários**

   - Crie testes unitários para funções isoladas.
   - Use mocks para banco de dados e Cloudflare R2.

2. **Configurar Testes End-to-End**

   - Crie testes que iniciam na rota HTTP e verificam o upload no R2 e banco de dados.
   - Limite o número de testes end-to-end para evitar lentidão.

3. **Criar Testes de Integração**

   - Crie um arquivo `uploadImage.spec.ts` para testar a função de upload e a integração com o banco de dados.
   - Garanta que o banco de dados esteja disponível e rápido durante os testes.

4. **Mockar Cloudflare R2**

   - Crie um mock para o Cloudflare R2 para evitar uploads reais durante os testes:
     ```typescript
     // filepath: src/app/services/upload-image.spec.ts
     beforeAll(() => {
       vi.mock('@/infra/storage/upload-file-to-storage', () => {
         return {
           uploadFileToStorage: vi.fn().mockImplementation(() => {
             return {
               key: `${randomUUID()}.jpg`,
               url: 'https://storage.com/image.jpg',
             }
           }),
         }
       })
     })
     ```

5. **Escrever Testes de Sucesso**

   - Escreva testes para verificar o sucesso do upload:

     ```typescript
     it('should be able to upload an image', async () => {
       const fileName = `${randomUUID()}.jpg`

       const sut = await uploadImage({
         fileName,
         contentType: 'image/jpg',
         contentStream: Readable.from([]),
       })

       expect(isRight(sut)).toBe(true)

       const result = await db
         .select()
         .from(schema.uploads)
         .where(eq(schema.uploads.name, fileName))

       expect(result).toHaveLength(1)
     })
     ```

6. **Escrever Testes de Erro**

   - Escreva testes para verificar o comportamento com arquivos inválidos:

     ```typescript
     it('should not be able to upload an invalid file', async () => {
       const fileName = `${randomUUID()}.pdf`

       const sut = await uploadImage({
         fileName,
         contentType: 'document/pdf',
         contentStream: Readable.from([]),
       })

       expect(isLeft(sut)).toBe(true)
       expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
     })
     ```

7. **Configurar Migrations para Testes**

   - Configure migrations para rodar antes dos testes:
     ```json
     // filepath: /path/to/package.json
     "scripts": {
         "db:migrate:test": "dotenv -e .env.test -- drizzle-kit migrate",
         "pretest": "pnpm run db:migrate:test",
         "pretest:watch": "pnpm run db:migrate:test",
     }
     ```

8. **Rodar Testes**
   - Execute os testes e verifique se todos passam:
     ```bash
     pnpm run test
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/9c73977e1aa758f88a08b5c94322caf59c66d116
```
