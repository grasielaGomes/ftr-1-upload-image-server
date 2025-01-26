# Tratamento Funcional de Erros

## Destaques

- **Problemas com Throw**: Dificuldade em identificar a origem dos erros.
- **Alternativas ao Try-Catch**: Uso de abordagens funcionais para lidar com erros.
- **Either**: Implementação de uma classe para tratar erros e sucessos.
- **Validação e Tratamento de Erros**: Uso de funções para verificar e tratar erros.

### Passo-a-Passo

1. **Entender Problemas com Throw**

   - Usar `throw` dificulta a identificação da origem dos erros.
   - Todos os erros caem no mesmo `catch`, dificultando o tratamento específico.

2. **Alternativas ao Try-Catch**

   - Usar abordagens funcionais como no Go e Elixir, onde funções retornam erro e resultado separados.

3. **Implementar a Classe Either**

   Acessar o arquivo either.ts na pasta recursos.

4. **Criar classe InvalidFileFormat**

   ```typescript
   // filepath: src/app/functions/errors/invalid-file-format.ts
   export class InvalidFileFormat extends Error {
     constructor() {
       super('Invalid file format.')
     }
   }
   ```

5. **Alterar retorno upload-image service**

   ```typescript
   // filepath: src/app/functions/upload-image.ts
   export async function uploadImage(
   input: UploadImageInput
   ): Promise<Either<InvalidFileFormat, { url: string }>> {
    const { contentStream, contentType, fileName } = uploadImageInput.parse(input)

    if (!allowedMimeTypes.includes(contentType)) {
      return makeLeft(new InvalidFileFormat())
    }

   ...

    return makeRight({ url: '' })
   }
   ```

6. **Tratar Erros na Rota**

   ```typescript
   // filepath: src/infra/http/routes/upload-image.ts
   import { isRight, unwrapEither } from '@/infra/shared/either'

   ...
   response: {
          201: z.null().describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },

    ...
      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (isRight(result)) {
        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
      }
   ```

7. **Testar Implementação**

- Acesse o Swagger UI e teste a rota de upload.
- Verifique se os erros são tratados corretamente e se os uploads são processados com sucesso.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/03a228c252611677f1a26824b147fe153de49a42
```
