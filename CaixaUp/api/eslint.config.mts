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
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "prettier": prettierPlugin,
      "import-x": importX
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
      quotes: ["error", "single"],
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