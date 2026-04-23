import globals from "globals"; 
import pluginJs from "@eslint/js"; 
import tsParser from "@typescript-eslint/parser"; 
import tsPlugin from "@typescript-eslint/eslint-plugin"; 

/** @type {import('eslint').Linter.Config[]} */ 
export default [ 
  pluginJs.configs.recommended, // Configurações recomendadas do ESLint 
  { 
    files: ["**/*.ts", "**/*.tsx"], // Aplica apenas a arquivos TypeScript 
    languageOptions: { 
      globals: globals.node, // Define variáveis globais do Node.js 
      ecmaVersion: 2021, // Usa ECMAScript 2021 
      sourceType: "module", // Permite o uso de módulos ES 
      parser: tsParser, // Usa o parser do TypeScript 
    }, 
    plugins: { 
      "@typescript-eslint": tsPlugin, // Usa o plugin do TypeScript 
    }, 
    rules: { 
      // Regras de estilo e boas práticas 
      "@typescript-eslint/naming-convention": [ 
        "error", 
        { 
          selector: "variable", // Aplica a regra a variáveis 
          format: ["camelCase", "PascalCase", "UPPER_CASE"], // Permite camelCase, PascalCase e UPPER_CASE, Deixe somente os necessários para seguir os padrões que você escolheu 
          leadingUnderscore: "allow", // Permite underscores no início (ex: _privateVar) 
        }, 
      ], 
      semi: ["error", "always"], // Exige ponto e vírgula no final das declarações 
      quotes: ["error", "double"], // Exige aspas duplas 
      indent: ["error", 2], // Indentação de 2 espaços 
      "no-trailing-spaces": "error", // Proíbe espaços em branco no final das linhas 
      "prefer-const": "error", // Exige o uso de 'const' para variáveis não reatribuídas 
      "no-param-reassign": "error", // Proíbe a reatribuição de parâmetros de funções 
      "array-bracket-spacing": ["error", "never"], // Proíbe espaços dentro de colchetes de arrays 
      "comma-dangle": ["error", "always-multiline"], // Exige vírgula no final de objetos/arrays multilinha 

      // Regras adicionais recomendadas 
      "no-console": "warn", // Avisa sobre o uso de console.log 
      "@typescript-eslint/no-unused-vars": "error", // Erro se uma variável não for usada 
      "import/no-cycle": "error", // Detecta dependências circulares 
      "object-curly-spacing": ["error", "always"], // Exige espaços dentro de chaves 
      "arrow-parens": ["error", "always"], // Exige parênteses em arrow functions 
      "no-var": "error", // Proíbe o uso de 'var' 
      "no-multiple-empty-lines": ["error", { "max": 1 }], // Limita linhas vazias consecutivas 
    }, 
  }, 
]; 