# Função de Upload de Imagem

## Destaques

- **Estrutura do Projeto**: Organização das pastas e arquivos.
- **Validação de Dados**: Uso do Zod para validar dados de entrada.
- **Streams no Node.js**: Uso de streams para manipulação de arquivos.
- **Boas Práticas**: Evitar problemas de memória ao lidar com uploads.
- **Tipos de Imagem Permitidos**: Definição de tipos de imagem aceitos.
- **Tratamento de Erros**: Validação e tratamento de erros.

### Passo-a-Passo

1. **Organizar Estrutura do Projeto**

   - Criar pastas `app`, `services` ou `functions` dentro de `source`.

2. **Criar Função de Upload de Imagem**

   ```typescript
   // filepath: src/app/services/upload-image.ts
   import { Readable } from 'node:stream'
   import { db } from '@/infra/db'
   import { schema } from '@/infra/db/schemas'
   import { z } from 'zod'

   const uploadImageInput = z.object({
     fileName: z.string(),
     contentType: z.string(),
     contentStream: z.instanceof(Readable),
   })

   type UploadImageInput = z.input<typeof uploadImageInput>

   const allowedMimeTypes = [
     'image/jpg',
     'image/jpeg',
     'image/png',
     'image/webp',
   ]

   export async function uploadImage(input: UploadImageInput) {
     const { contentStream, contentType, fileName } =
       uploadImageInput.parse(input)

     if (!allowedMimeTypes.includes(contentType)) {
       throw new Error('Invalid file format.')
     }

     // TODO: carregar a imagem p/ o Cloudflare R2

     await db.insert(schema.uploads).values({
       name: fileName,
       remoteKey: fileName,
       remoteUrl: fileName,
     })
   }
   ```

3. **Configurar Rota de Upload**

   ```typescript
   // filepath: src/infra/http/routes/upload-image.ts
   import { uploadImage } from '@/app/functions/upload-image'

   ...

   400: z.object({ message: z.string() }),

   ...

     if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required.' })
      }

      await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })
   ...
   ```

4. **Testar Implementação**
   - Acesse o Swagger UI e teste a rota de upload.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/fcf3f5bac61091304b28a59561d0aee3ff4945d2
```
