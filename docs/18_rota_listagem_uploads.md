# Rota de Listagem de Uploads

## Destaques

- **Criação da Rota**: Implementação da rota `get uploads`.
- **Agrupamento de Tags**: Agrupamento das rotas de upload em uma categoria.
- **Retorno em JSON**: Uso de JSON para o retorno dos dados.
- **Tipagem de Resposta**: Tipagem da resposta com Zod.
- **Paginação e Filtros**: Implementação de paginação e filtros via query string.

### Passo-a-Passo

1. **Criar a Rota getUploads**

   - Copie a estrutura da rota `uploadImage` e altere para `getUploadsRoute`:
     ```typescript
     // filepath: src/infra/http/routes/get-uploads.ts
     export const getUploadsRoute: FastifyPluginAsyncZod = async (server) => {
       server.get('/uploads', async (request, reply) => {
         // Implementação da rota
       })
     }
     ```

2. **Atualizar Schema**

   - Atualize o summary e remova o `multipart/form-data`:
     ```typescript
     summary: 'Get uploads',
     ```

3. **Agrupar Tags**

   - Use uma tag para agrupar as rotas de upload:

     ```typescript
     tags: ['uploads'],
     ```

#### Vantagem de Agrupar Rotas

- **Documentação**: Melhora a documentação automática (por exemplo, usando Swagger), permitindo que os desenvolvedores vejam claramente quais rotas pertencem a qual grupo.
- **Segurança**: Permite aplicar políticas de segurança específicas a grupos de rotas, como autenticação e autorização.

4. **Adicionar query string**

   - Adicione validação para query strings:
     ```typescript
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
     ```

5. **Configurar Resposta**

   - Configure a resposta para retornar status 200 e um objeto com uploads:
     ```typescript
     response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
     ```

6. **Adicionar corpo da função**

   ```typescript
   ;async (request, reply) => {
     const { page, pageSize, searchQuery, sortBy, sortDirection } =
       request.query

     const result = await getUploads({
       page,
       pageSize,
       searchQuery,
       sortBy,
       sortDirection,
     })

     const { total, uploads } = unwrapEither(result)

     return reply.status(200).send({ total, uploads })
   }
   ```

7. **Adicionar tag uploads no shema da rota uploadImage**

   ```typescript
   schema: {
      summary: 'Upload an image',
      tags: ['uploads'],
   ```

8. **Cadastrar a Rota no Servidor**

   - Cadastre a rota no servidor:
     ```typescript
     server.register(getUploadsRoute)
     ```

9. **Testar a Rota**
   - Acesse a documentação e teste a rota de listagem de uploads:
     ```plaintext
     Acesse a documentação em http://localhost:3333/docs
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/08e4f32fefbf8ca7c930a3c1fd1aeb33dd30e6d4
```
