import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["dist", ".react-router/*", "build/*"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
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
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": [
        "error",
        "double",
        { "allowTemplateLiterals": true, "avoidEscape": true }
      ],
      "no-empty-pattern": [
        "error",
        { "allowObjectPatternsAsParameters": true }
      ],
      "react/prop-types": ["off"]
    },
  },
];