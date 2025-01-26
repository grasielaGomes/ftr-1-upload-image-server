# Setup do projeto

## Destaques

- Desenvolvimento de um servidor de upload de arquivos usando Node e Cloudflare R2.
- Foco em boas práticas, especialmente em upload de arquivos e geração de relatórios.
- Uso de Docker, documentação de API, geração de IDs, streaming e tratamento de erros.
- Configuração do projeto do zero, instalação de dependências e ajuste do TypeScript.
- Ferramentas e bibliotecas utilizadas:
  - pnpm;
  - TypeScript;
  - Biome para formatação de código;
  - Fastify, Fastify Cors, Zod, Fastify Type Provider Zod;
- Configuração do TSConfig para usar ECMAScriptModules.
- Criação de scripts no package.json para desenvolvimento.
- Configuração do Biome no VSCode para formatação automática.
- Criação de um servidor Fastify simples.
- Configuração do git e criação de um .gitignore.

- **pnpm**: Gerenciador de pacotes JavaScript que ajuda na instalação e gerenciamento de dependências do projeto.
- **TypeScript**: Um superset do JavaScript que adiciona tipagem estática opcional ao código.
- **typesnode**: Tipos TypeScript para Node.js, permitindo melhor suporte de tipagem ao usar APIs do Node.js.
- **tsx**: Ferramenta para executar arquivos TypeScript diretamente sem precisar de uma etapa de compilação separada.
- **Biome**: Ferramenta para formatação de código, garantindo um estilo consistente em todo o projeto.
- **Fastify**: Framework web rápido e de baixo overhead para Node.js, focado em eficiência e simplicidade.
- **Fastify Cors**: Plugin para o Fastify que habilita o suporte a CORS (Cross-Origin Resource Sharing).
- **Zod**: Biblioteca de validação e parsing de esquemas para TypeScript.
- **Fastify Type Provider Zod**: Integração do Zod com Fastify para validação de tipos e esquemas.

### Passo 1: Inicializar o Projeto

1. Crie um novo projeto Node.js:
   ```sh
   pnpm init
   ```

### Passo 2: Instalar Dependências

2. Instale as dependências necessárias:
   ```sh
   pnpm add fastify @fastify/cors zod fastify-type-provider-zod
   pnpm add @biomejs/biome typescript @types/node tsx -D
   ```

### Passo 3: Configurar TypeScript

3. Inicialize o TypeScript:
   ```sh
   tsc --init
   ```
4. Atualize o

tsconfig.json

com as configurações recomendadas:

- Altere `moduleResolution` para `bundler`.
- Altere `module` e `target` para `ESNext`.
- Adicione paths customizados:
  ```json
  "paths": {
    "@/*": ["src/*"]
  }
  ```

Veja um exemplo do tsconfig na pasta `Exemplos`.

### Passo 4: Configurar Scripts no

package.json

5. Adicione um script de desenvolvimento no

package.json

:

```json
"scripts": {
  "dev": "tsx watch src/infra/http/server.ts"
}
```

### Passo 5: Criar Estrutura de Pastas e Arquivos

6. Crie a estrutura de pastas e arquivos:
   ```sh
   mkdir -p src/infra/http
   touch src/infra/http/server.ts
   ```

### Passo 6: Configurar o Servidor Fastify

7. No arquivo `server.ts`, adicione o seguinte código:

   ```typescript
   import Fastify from 'fastify'
   import fastifyCors from '@fastify/cors'

   const server = Fastify()

   server.register(fastifyCors, {
     origin: '*',
   })

   server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
     if (err) {
       console.error(err)
       process.exit(1)
     }
     console.log(`HTTP server running at ${address}`)
   })
   ```

### Passo 7: Configurar Biome

8. Instale a extenção do Biome para o VSCode. Inicialize o Biome:
   ```sh
   pnpm biome init
   ```
9. Atualize o `biome.json` com as configurações desejadas:

   ```json
   {
     "javascript": {
       "formatter": {
         "quoteStyle": "single",
         "semicolons": "asNeeded",
         "arrowParentheses": "asNeeded",
         "jsxQuoteStyle": "double",
         "trailingCommas": "es5"
       }
     }
   }
   ```

   Veja um exemplo de `biome.json`na pasta `Exemplos`.

### Passo 8: Configurar o Editor (VSCode)

10. Adicione as configurações do Biome no VSCode:
    - Abra as configurações do workspace (`Ctrl/Command+Shift+P` > `Preferences: Open Workspace Settings (JSON)`) e adicione:
      ```json
      {
        "editor.formatOnSave": true,
        "[typescript]": {
          "editor.defaultFormatter": "biome"
        },
        "editor.codeActionsOnSave": {
          "source.organizeImports.biome": true
        }
      }
      ```

### Passo 9: Configurar .gitignore

11. Crie um arquivo `.gitignore` e adicione:

```plaintext
node_modules
.env
dist
```

### Passo 10: Inicializar Git

12. Inicialize um repositório Git:
    ```sh
    git init
    git add .
    git commit -m "Setup do projeto"
    ```

### Passo 11: Rodar o Projeto

13. Inicie o servidor de desenvolvimento:
    ```sh
    pnpm run dev
    ```

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/8319dcb880bdc7eb69ef4e99e1429b23713298b9
```
