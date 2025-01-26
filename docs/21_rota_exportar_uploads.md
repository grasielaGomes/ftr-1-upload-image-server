# Rota para Exportar Uploads

## Destaques

- **Criação da Rota**: Implementação da rota `export uploads`.
- **Query String**: Uso de `search query` para filtrar os uploads.
- **Método POST**: Configuração da rota com o método POST.
- **Resposta com URL**: Retorno de uma URL para o relatório exportado.
- **Testes Manuais**: Realização de testes manuais para verificar o funcionamento.

### Passo-a-Passo

1. **Criar a Rota exportUploads**

   ```typescript
   // filepath: src/infra/http/routes/export-uploads.ts
   import { exportUploads } from '@/app/services/export-uploads'
   import { unwrapEither } from '@/infra/shared/either'
   import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
   import { z } from 'zod'

   // Definição da rota para exportar uploads
   export const exportUploadsRoute: FastifyPluginAsyncZod = async (server) => {
     // Definição da rota POST /uploads/exports
     server.post(
       '/uploads/exports',
       {
         schema: {
           summary: 'Export uploads', // Resumo da rota
           tags: ['uploads'], // Tag para agrupar rotas relacionadas a uploads
           querystring: z.object({
             searchQuery: z.string().optional(), // Parâmetro de consulta opcional para busca
           }),
           response: {
             200: z.object({
               reportUrl: z.string(), // Estrutura da resposta esperada com a URL do relatório
             }),
           },
         },
       },
       // Função assíncrona que lida com a requisição
       async (request, reply) => {
         // Extração do parâmetro de consulta da requisição
         const { searchQuery } = request.query

         // Chamada da função exportUploads com o parâmetro de consulta
         const result = await exportUploads({
           searchQuery,
         })

         // Desembrulha o resultado da função exportUploads
         const { reportUrl } = unwrapEither(result)

         // Envia a resposta com a URL do relatório
         return reply.status(200).send({ reportUrl })
       }
     )
   }
   ```

2. **Registrar a Rota no Servidor**

   - Adicione a rota `export uploads` no servidor:
     ```typescript
     server.register(exportUploadsRoute)
     ```

3. **Testar a Rota Manualmente**

   - Execute o servidor e teste a rota manualmente:
     ```bash
     pnpm run dev
     ```

4. **Acessar a Documentação**

   - Acesse a documentação em `http://localhost:3333/docs` e teste a rota:
     ```plaintext
     Acesse a rota `POST /uploads/exports` e execute com a query string vazia.
     ```

5. **Verificar CSV Gerado**
   - Verifique se o CSV foi gerado corretamente e contém as informações esperadas:
     ```plaintext
     Baixe e abra o CSV gerado para confirmar os dados.
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/0bbef28b344363c77ab99d17267876ab833adca1
```
