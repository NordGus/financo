import pluginJs from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["dist", ".react-router/*"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      "@stylistic/ts/indent": ["error", 2],
      "@stylistic/ts/quotes": [
        "error",
        "double",
        { "allowTemplateLiterals": true }
      ],
    },
  },
];