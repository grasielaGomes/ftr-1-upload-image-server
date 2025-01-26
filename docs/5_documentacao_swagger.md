# Documentação com Swagger

## Destaques

- **Instalação de Pacotes**: Swagger e Swagger UI.
- **Configuração do Swagger**: Suporte a multi-part form data e JSON.
- **Cadastro de Plugins**: Fastify Multipart e Fastify Swagger. A biblioteca Fastify Multipart é usada para lidar com uploads de arquivos em aplicações Fastify. Ela permite que você processe dados de formulários multipart/form-data, que é o tipo de conteúdo usado para enviar arquivos através de formulários HTML.
- **Configurações do Swagger**: Uso do padrão OpenAPI.
- **Definição de Esquemas**: Configuração de rotas com summary, body e respostas.
- **Registro do Swagger UI**: Configuração do prefixo de rota para documentação.
- **Testes de Rotas**: Uso do Swagger UI para testar e visualizar rotas e respostas.

### Passo-a-Passo

1. **Instalar Pacotes**

   ```bash
   pnpm add @fastify/multipart @fastify-swagger @fastify/swagger-ui
   ```

2. **Cadastrar Plugins no Servidor**

   ```typescript
   server.register(fastifyCors, { origin: '*' })

   server.register(fastifyMultipart)
   server.register(fastifySwagger, {
     openapi: {
       info: {
         title: 'Upload Server',
         version: '1.0.0',
       },
     },
     transform: jsonSchemaTransform,
   })
   server.register(fastifySwaggerUi, {
     routePrefix: '/docs',
   })
   ```

3. **Definir Esquemas de Rotas**

   ```typescript
   server.post(
     '/uploads',
     {
       schema: {
         summary: 'Upload an image',
         body: z.object({
           name: z.string(),
           password: z.string().optional(),
         }),
         response: {
           201: z.object({ uploadId: z.string() }),
           409: z
             .object({ message: z.string() })
             .describe('Upload already exists.'),
         },
       },
     },
     async (request, reply) => {
       return reply.status(201).send({ uploadId: '123' })
     }
   )
   ```

4. **Rodar o Servidor e Acessar Documentação**

   ```bash
   pnpm run dev
   ```

   - Acesse `http://localhost:3333/docs` para visualizar a documentação.

5. **Testar Rotas no Swagger UI**
   - Utilize a interface do Swagger UI para testar as rotas definidas e verificar as respostas configuradas.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/bb46c05c5aa6eb20e6a39517818623ca3af83754
```
