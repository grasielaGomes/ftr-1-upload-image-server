# Upload de Arquivos para o Cloudflare R2

## Destaques

- **Função de Upload**: Criação de função para upload de arquivos.
- **Validação de Dados**: Uso do Zod para validar dados de entrada.
- **Geração de Nome Único**: Criação de nomes únicos para os arquivos.
- **Uso de Streams**: Manipulação de arquivos usando streams.
- **Organização em Pastas**: Organização de arquivos em pastas específicas.
- **Regras de Lifecycle**: Configuração de regras de ciclo de vida para os arquivos.

### Passo-a-Passo

1. **Criar Função de Upload**

   - Crie uma função para fazer upload de arquivos para o R2.

   ```typescript
   import { z } from 'zod'
   import { Readable } from 'stream'
   import { extname, basename } from 'path'
   import { randomUUID } from 'crypto'
   import { Upload } from 'some-upload-library'

   // Definição do esquema de validação para os dados de entrada
   const uploadFileToStorageInput = z.object({
     folder: z.enum(['images', 'downloads']),
     fileName: z.string(),
     contentType: z.string(),
     contentStream: z.instanceof(Readable),
   })

   // Tipo derivado do esquema de validação
   type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>

   // Função para fazer o upload do arquivo para o armazenamento
   export async function uploadFileToStorage(input: UploadFileToStorageInput) {
     // Validação dos dados de entrada
     const { folder, fileName, contentType, contentStream } =
       uploadFileToStorageInput.parse(input)

     // Extração da extensão do arquivo
     const fileExtension = extname(fileName)
     // Extração do nome do arquivo sem a extensão
     const fileNameWithoutExtension = basename(fileName, fileExtension)
     // Sanitização do nome do arquivo, removendo caracteres especiais
     const sanitizedFileName = fileNameWithoutExtension.replace(
       /[^a-zA-Z0-9]/g,
       ''
     )
     // Recriação do nome do arquivo com a extensão
     const sanitizedFileNameWithExtension =
       sanitizedFileName.concat(fileExtension)

     // Criação de um nome de arquivo único usando UUID e uma pasta específica
     const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`

     // Configuração do upload com os parâmetros necessários
     const upload = new Upload({
       client: r2,
       params: {
         Key: uniqueFileName,
         Bucket: env.CLOUDFLARE_BUCKET,
         Body: contentStream,
         ContentType: contentType,
       },
     })

     // Execução do upload
     await upload.done()

     // Retorno da chave e URL do arquivo armazenado
     return {
       key: uniqueFileName,
       url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
     }
   }
   ```

2. **Adicionar função de upload no service**

   ```typescript
   // filepath: src/app/functions/upload-image.ts
   const { key, url } = await uploadFileToStorage({
     folder: 'images',
     fileName,
     contentType,
     contentStream,
   })

   await db.insert(schema.uploads).values({
     name: fileName,
     remoteKey: key,
     remoteUrl: url,
   })
   ```

3. **Configurar Regras de Lifecycle**

   - Configure regras de ciclo de vida para os arquivos no Cloudflare:
     - Apagar arquivos após um período específico (e.g., 7 dias).

4. **Testar Implementação**
   - Teste a rota de upload no Swagger UI.
   - Verifique se os arquivos são enviados corretamente e se as URLs são geradas.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/d9deb35731c160d4a7a9edcf7867d0234752d498
```
