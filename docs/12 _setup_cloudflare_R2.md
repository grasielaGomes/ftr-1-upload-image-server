# Setup do Cloudflare R2

## Destaques

- **Plano Gratuito**: Uso do plano gratuito da Cloudflare (necessário cartão).
- **Vantagens do Cloudflare R2**: Não cobra por download de imagem, mais barato que S3.
- **Criação de Bucket**: Configuração de bucket público.
- **Configuração de API Key**: Criação e configuração de chave de API.
- **Uso da API AWS**: Cloudflare R2 utiliza a mesma API do AWS S3.

### Passo-a-Passo

1. **Criar Conta na Cloudflare**

   - Acesse a Cloudflare e crie uma conta gratuita.
   - Configure um cartão de crédito (necessário para o plano gratuito).

2. **Criar Bucket no Cloudflare R2**

   - Acesse o R2 (Object Storage) na Cloudflare.
   - Escolha o plano gratuito e insira os dados do cartão.
   - Crie um bucket chamado `upload server`.
   - Escolha localização `Automática`.
   - Escolha classe de armazenamento `Standard`.

3. **Configurar Acesso Público ao Bucket**

   - Vá em `settings` do bucket.
   - Habilite o acesso público do bucket em `Subdomínio R2.dev`.
   - Adicione a politica de CORS padrão.

4. **Configurar Chave de API**

- Crie um token com permissões de leitura e escrita apenas para o bucket criado.

- Crie um arquivo `.env` na aplicação e adicione as variáveis:
  ```plaintext
  CLOUDFLARE_ACCOUNT_ID=""
  CLOUDFLARE_ACCESS_KEY_ID=""
  CLOUDFLARE_SECRET_ACCESS_KEY=""
  CLOUDFLARE_BUCKET=""
  CLOUDFLARE_PUBLIC_URL=""
  ```

3.  **Adicionar validação das novas envs**

```typescript
// filepath: src/env.ts
 CLOUDFLARE_ACCOUNT_ID: z.string(),
 CLOUDFLARE_ACCESS_KEY_ID: z.string(),
 CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
 CLOUDFLARE_BUCKET: z.string(),
 CLOUDFLARE_PUBLIC_URL: z.string().url(),
```

1.  **Instalar sdk AWS**

    - Instale o sdk da AWS:

    ```bash
    pnpm add @aws-sdk/client-s3 @aws-sdk/lib-storage
    ```

2.  **Configurar Cliente no Projeto**

    - Crie uma pasta `storage` dentro de `infra`.
    - Crie um arquivo `client.ts` com a configuração do cliente:

```typescript
// filepath: src/infra/storage/client.ts
import { env } from '@/env'
import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})
```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/a973a9840ad1c1e3f236a6c986b181cefeea0d33
```
