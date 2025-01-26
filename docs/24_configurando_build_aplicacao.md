# Configurando o Build da Aplicação

## Destaques

- **Utilização da lib tsup**: Uso da biblioteca tsup para o processo de build.
- **Esbuild**: Esbuild utilizado por baixo dos panos para um build rápido.
- **Configuração do tsup-config**: Criação e configuração do arquivo tsup-config.
- **Comando de Build**: Criação de um comando de build no package.json.
- **Teste da Build**: Teste da build gerada e configuração de variáveis de ambiente.

### Passo-a-Passo

1. **Instalar tsup**

   ```bash
   pnpm add -D tsup
   ```

1. **Criar tsup-config**

   - Crie e configure o arquivo `tsup-config`:

     ```typescript
     // filepath: tsup.config.ts
     import { defineConfig } from 'tsup'

     export default defineConfig({
       entry: 'src/**/*.ts',
       clean: true,
       format: 'esm',
       outdir: 'dist',
     })
     ```

1. **Adicionar Comando de Build no package.json**

   - Adicione o comando de build no `package.json`:
     ```json
     "scripts": {
         "build": "tsup-node"
     }
     ```

1. **Executar o Build**

   - Execute o comando de build:
     ```bash
     pnpm run build
     ```

1. **Testar a Build**

   - Teste a build gerada:
     ```bash
     node dist/infra/http/server.js
     ```

1. **Configurar Variáveis de Ambiente**

   - Configure as variáveis de ambiente para a build:
     ```bash
     node --env-file=.env dist/infra/http/server.js
     ```

1. **Evitar Uso de .env em Produção**
   - Evite usar arquivos `.env` diretamente em produção, injete as variáveis de outras formas.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/6c9633a089c326b0557db6e5768bdb5dc22d9d34
```
