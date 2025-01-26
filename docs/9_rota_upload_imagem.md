# Rota de Upload de Imagem

## Destaques

- **Configuração do Swagger**: Ajuste para receber arquivos.
- **Multipart/Form-Data**: Configuração para aceitar arquivos.
- **Transformação de Esquema**: Customização do JSON Schema Transform.
- **Acesso ao Arquivo**: Uso do Fastify Multipart para acessar arquivos.
- **Limite de Tamanho**: Configuração de limite de tamanho de arquivo.

### Passo-a-Passo

1. **Configurar Swagger para Receber Arquivos**

   - Ajustar a rota para consumir `multipart/form-data`.
   - Remover o body inicial da rota.

2. **Criar Função de Transformação de Esquema**

   ```typescript
   // filepath: src/infra/http/transform-swagger-schema.ts
   import { jsonSchemaTransform } from 'fastify-type-provider-zod'

   type TransformSwaggerSchemaDAta = Parameters<typeof jsonSchemaTransform>[0]

   export function transformSwaggerSchema(data: TransformSwaggerSchemaDAta) {
     const { schema, url } = jsonSchemaTransform(data)

     if (schema.consumes?.includes('multipart/form-data')) {
       if (schema.body === undefined) {
         schema.body = {
           type: 'object',
           required: [],
           properties: {},
         }
       }

       schema.body.properties.file = {
         type: 'string',
         format: 'binary',
       }

       schema.body.required.push('file')
     }

     return { schema, url }
   }
   ```

   A função transformSwaggerSchema transforma um esquema JSON usando a função jsonSchemaTransform do pacote fastify-type-provider-zod. Ela recebe dados, aplica a transformação e extrai o esquema e a URL resultantes. O objetivo é ter, na documentação do Swagger, um upload de arquivo e tipagem correta na rota de upload de imagens.

3. **Aplicar Transformação no Servidor**

   ```typescript
   // filepath: src/infra/http/server.ts
   server.register(fastifySwagger, {
     openapi: {
       info: {
         title: 'Upload Server',
         version: '1.0.0',
       },
     },
     transform: transformSwaggerSchema,
   })
   ```

4. **Configurar Limite de Tamanho de Arquivo**

   ```typescript
   // filepath: src/infra/http/routes/upload-image.ts
   fastify.post(
     '/upload',
     {
       schema: {
         consumes: ['multipart/form-data'],
       },
     },
     async (request, reply) => {
       const uploadedFile = await request.file({
         limits: {
           fieldSize: 1024 * 1024 * 4, // 4mb
         },
       })
       console.log(uploadedFile)
     }
   )
   ```

5. **Testar Rota de Upload**
   - Acesse o Swagger UI e teste a rota de upload.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/89bcc4522c166181c07c7eaaf368170b1222dee7
```
