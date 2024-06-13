import globals from "globals";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import nodePlugin from "eslint-plugin-node";
import airbnbBase from "eslint-config-airbnb-base";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 12,
      sourceType: "module"
    },
    plugins: {
      import: importPlugin,
      node: nodePlugin
    },
    rules: {
      // Các quy tắc từ Airbnb base
      ...airbnbBase.rules,
      // Naming Conventions
      camelcase: ["error", { properties: "always" }],
      "no-underscore-dangle": "off",

      // Code Formatting
      indent: ["error", 4],
      "max-len": ["error", { code: 120 }],
      "no-trailing-spaces": "error",
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-infix-ops": "error",
      "comma-spacing": ["error", { before: false, after: true }],
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      "no-multiple-empty-lines": ["error", { max: 1 }],

      // Best Practices
      "no-console": "warn",
      "consistent-return": "error",

      // Style
      "array-bracket-spacing": ["error", "never"],
      "block-spacing": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "comma-dangle": ["error", "never"],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-const": "error",
      "no-var": "error",
      "arrow-spacing": ["error", { before: true, after: true }]
    }
  }
];