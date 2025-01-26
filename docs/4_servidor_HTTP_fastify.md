# Configuração Adicional do Fastify

## Destaques

- **Integração com Zod**:

  - Validação de dados de entrada.
  - Serialização de dados de saída.
  - Uso do `fastify-type-provider-zod` para validação e serialização.

- **Error Handler Global**:

  - Captura de erros não tratados nas rotas.
  - Tratamento de erros de validação com resposta 400.
  - Tratamento de outros erros com resposta 500 e log.

- **Estrutura de Rotas**:

  - Criação de rotas com validação e serialização.
  - Exemplo de rota `uploadImage.ts`.

- **Ferramentas de Teste**:
  - Uso de HTTPie, Insomnia, Postman para testar rotas.

## Passo-a-Passo

1. **Integre o Zod no Fastify**:

   - Adicione o `fastify-type-provider-zod` para validação e serialização.
   - Configure o server.setValidatorCompiler e server.setSerializerCompiler com Zod em `src/infra/http/server.ts`.

   <br>

   ```typescript
   const server = fastify()

   server.setValidatorCompiler(validatorCompiler)
   server.setSerializerCompiler(serializerCompiler)
   ```

2. **Crie um Error Handler Global**:

- Adicione um `setErrorHandler` para capturar erros não tratados.

- Trate erros de validação com `reply.status(400).send({ message: 'Validation error', issues: error.validation })`.
- Trate outros erros com `console.error` e resposta 500.

```typescript
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  // Envia o erro p/ alguma ferramenta de observabilidade (Sentry/DataDog/Grafana/OTel)

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})
```

3. **Crie a Estrutura de Rotas**:

- Dentro da pasta HTTP, crie um arquivo de rota, por exemplo, `routes/uploadImage.ts`.
- Exporte uma função `uploadImageRoute` que recebe a instância do Fastify.
- Cadastre a rota com `server.post('/uploads', async (request, reply) => { return 'hello world'; })`.

```typescript
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/uploads', () => {
    return 'Hello World'
  })
}
```

- Adicione a rota no `infra/http/server.ts`

```typescript
server.register(uploadImageRoute)
```

4. **Teste a Rota Criada**:

- Salve as alterações e rode `pnpm run dev`.
- Teste a rota `http://localhost:3333/uploads` usando HTTPie, Insomnia, Postman ou outra ferramenta.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/6e58c042ea8113b2824d09466828a421f367de4d
```
