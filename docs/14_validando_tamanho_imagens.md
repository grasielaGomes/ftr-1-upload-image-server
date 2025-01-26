# Validando Tamanho de Imagens

## Destaques

- **Uploads Grandes**: Lidar com uploads de imagens que excedem o limite permitido.
- **Streaming**: Uso de streaming para envio de dados em partes.
- **Fastify Multipart**: Abortar upload ao atingir o limite.
- **Cloudflare R2**: Exclusão automática de uploads incompletos após sete dias.
- **Tratamento de Erros**: Identificar e retornar erro caso o limite seja ultrapassado.

### Passo-a-Passo

2. **Verificar se o Arquivo Excedeu o Limite**

   - Após a variável `result`, adicione o código para verificar se o arquivo foi truncado:
     ```typescript
     if (uploadedFile.file.truncated) {
       return reply.status(400).send({ message: 'File size limit reached.' })
     }
     ```

3. **Abortar Upload ao Atingir o Limite**

   - O Fastify Multipart aborta automaticamente o upload ao atingir o limite configurado.

4. **Excluir Uploads Incompletos no Cloudflare R2**

   - Por padrão, o Cloudflare R2 exclui automaticamente uploads incompletos após sete dias.

5. **Testar Implementação**
   - Teste a rota de upload no Swagger UI.
   - Tente enviar um arquivo que exceda o limite permitido e verifique se o erro é retornado corretamente.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/467f291318aba862d13121d49d62d44ba881043d
```
