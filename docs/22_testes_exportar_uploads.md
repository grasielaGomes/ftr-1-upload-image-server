# Testes para Exportação de Uploads

## Destaques

- **Mock de Upload**: Mock da funcionalidade de upload para o storage.
- **Spy e Stub**: Uso de Spy para monitorar execuções e Stub para modificar comportamentos.
- **Verificação de Conteúdo**: Garantia de que o conteúdo do CSV está correto.
- **Conversão de Buffer**: Conversão de dados de buffer para string legível.
- **Validação de CSV**: Validação do conteúdo gerado do CSV.

### Passo-a-Passo

1. **Criar Mock de Upload**

   - Crie um mock para a funcionalidade de upload para o storage:
     ```typescript
     // filepath: src/app/services/export-uploads.spec.ts
     const uploadStub = vi
       .spyOn(upload, 'uploadFileToStorage')
       .mockImplementationOnce(async () => {
         return {
           key: `${randomUUID()}.csv`,
           url: 'http://example.com/file.csv',
         }
       })
     ```

2. **Chamar Função de Exportação**

   - Crie os uploads e chame a função de exportação:
     ```typescript
     const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
     const csvAsString = await new Promise<string>((resolve, reject) => {
       const chunks: Buffer[] = []
     })
     ```

3. **Obter Conteúdo Gerado**

   - Obtenha o conteúdo gerado pelo mock:

     ```typescript
     generatedCSVStream.on('data', (chunk: Buffer) => {
       chunks.push(chunk)
     })

     generatedCSVStream.on('end', () => {
       resolve(Buffer.concat(chunks).toString('utf-8'))
     })

     generatedCSVStream.on('error', (err) => {
       reject(err)
     })
     ```

4. **Converter Buffer para String**

   - Converta o buffer para uma string legível:
     ```typescript
     const csvAsArray = csvAsString
       .trim()
       .split('\n')
       .map((row) => row.split(','))
     ```

5. **Validar Conteúdo do CSV**

   - Valide que o conteúdo do CSV está correto:
     ```typescript
     expect(isRight(sut)).toBe(true)
     expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
     ```

6. **Verificar URL do Relatório**
   - Verifique se a URL do relatório está correta:
     ```typescript
     expect(csvAsArray).toEqual([
       ['ID', 'Name', 'URL', 'Uploaded at'],
       [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
       [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
       [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
       [upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
       [upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)],
     ])
     ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/c86bb10217dc232d25d26ab4d40d84279650b04b
```
