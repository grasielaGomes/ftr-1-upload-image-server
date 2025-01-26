# Função para Exportar Uploads (CSV)

## Destaques

- **CSV Stringify**: Uso da biblioteca CSV Stringify para criar e escrever CSVs.
- **Pipeline do Node.js**: Utilização do método pipeline para processar dados em streams.
- **Transform Streams**: Implementação de transform streams para manipulação de dados.
- **Armazenamento no Cloudflare R2**: Salvamento dos arquivos CSV no Cloudflare R2.

### Passo-a-Passo

1. **Instalar CSV Stringify**

   ```bash
   pnpm add csv-stringify
   ```

2. **Configurar CSV Stringify**

   - Configure o delimitador e o cabeçalho do CSV:
     ```typescript
     // filepath: src/app/functions/export-uploads.ts
     const csv = stringify({
       delimiter: ',',
       header: true,
       columns: [
         { key: 'id', header: 'ID' },
         { key: 'name', header: 'Name' },
         { key: 'remote_url', header: 'URL' },
         { key: 'created_at', header: 'Uploaded at' },
       ],
     })
     ```

3. **Criar Pipeline**

   - Utilize o método `pipeline` do Node.js para processar dados em streams e implemente uma transform stream para manipular os dados:

     ```typescript
     const uploadToStorageStream = new PassThrough()

     const convertToCSVPipeline = pipeline(
       cursor,
       new Transform({
         objectMode: true,
         transform(chunks: unknown[], encoding, callback) {
           for (const chunk of chunks) {
             this.push(chunk)
           }

           callback()
         },
       }),
       csv,
       uploadToStorageStream
     )
     ```

4. **Configurar Upload para Cloudflare R2**

   - Configure o upload do arquivo CSV para o Cloudflare R2:
     ```typescript
     const uploadToStorage = uploadFileToStorage({
       contentType: 'text/csv',
       folder: 'downloads',
       fileName: `${new Date().toISOString()}-uploads.csv`,
       contentStream: uploadToStorageStream,
     })
     ```

5. **Retornar URL do Arquivo**

   - Retorne a URL do arquivo CSV exportado:

     ```typescript
     const [{ url }] = await Promise.all([
       uploadToStorage,
       convertToCSVPipeline,
     ])

     return makeRight({ reportUrl: url })
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/883c8860b3e34942604978d0c33b765176f8bec0
```
