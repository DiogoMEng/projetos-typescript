import globals from "globals"; 
import pluginJs from "@eslint/js"; 
import tsParser from "@typescript-eslint/parser"; 
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";

/** @type {import('eslint').Linter.Config[]} */ 
export default [ 
  pluginJs.configs.recommended, // Configurações recomendadas do ESLint 
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      sourceType: "commonjs",
    }
  },
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
      "prettier": prettierPlugin, // Usa o plugin do Prettier
      "import-x": importX // Usa o plugin do Import-X
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-trailing-spaces": "error",
      "prefer-const": "error",
      "no-param-reassign": "error",
      "array-bracket-spacing": ["error", "never"],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "import-x/no-cycle": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-parens": ["error", "always"],
      "no-var": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
    },
  }, 
]; 