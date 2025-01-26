# Configuração de Testes com Vitest

## Destaques

- **Framework de Testes**: Uso do Vitest, preferido em relação ao Jest por ser mais rápido.
- **Configuração de Caminhos**: Uso do Vitest Config Paths para leitura correta do tsconfig.
- **Scripts de Teste**: Configuração de scripts no package.json para rodar testes.
- **Variáveis de Ambiente**: Uso do .env-cli para carregar variáveis de ambiente específicas para testes.
- **Modo Watch**: Uso de flags no modo watch para rodar todos os testes ou apenas os falhados.

### Passo-a-Passo

1. **Instalar VTest e .env-cli**

   ```bash
   pnpm add -D vitest vite-tsconfig-paths dotenv-cli
   ```

2. **Criar Arquivo de Configuração do Vitest**

   ```typescript
   // filepath: vite.config.mjs
   import tsconfigPaths from 'vite-tsconfig-paths'
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     plugins: [tsconfigPaths()],
   })
   ```

3. **Adicionar Scripts de Teste no `package.json`**

   ```json
   "scripts": {
       "test": "dotenv -e .env.test -- vitest run",
       "test:watch": "dotenv -e .env.test -- vitest"
   }
   ```

4. **Criar Arquivo de Teste Exemplo**

   ```typescript
   // filepath: /path/to/example.spec.ts
   import { test, expect } from 'vitest'

   test('1 + 1 should equal 2', () => {
     expect(1 + 1).toBe(2)
   })
   ```

5. **Rodar os Testes**

   ```bash
   pnpm run test
   ```

6. **Rodar os Testes em Modo Watch**

   ```bash
   pnpm run test:watch
   ```

   - **Flags Úteis no Modo Watch**:
     - `A`: Rodar todos os testes novamente.
     - `F`: Rodar apenas os testes falhados.
     - `P`: Filtrar quais arquivos rodar.

### Code

```
https://github.com/grasielaGomes/ftr-1-upload-image-server/commit/835f6138597805d3cf74f9fe645908fa3a10cfe1
```
