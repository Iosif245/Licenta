import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: [
      "dist/**/*",
      "node_modules/**/*",
      "*.tsbuildinfo",
      "vite.config.d.ts",
      "ConnectCampus-web/**/*",
      "commands/**/*"
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setImmediate: "readonly",
        queueMicrotask: "readonly",
        performance: "readonly",
        reportError: "readonly",
        process: "readonly",
        MessageChannel: "readonly",
        MutationObserver: "readonly",
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "@typescript-eslint": ts,
      import: importPlugin,
      prettier,
    },
    settings: {
      react: {
        version: "detect",
      }
    },
    rules: {
      "import/no-unresolved": "off",
      "react/jsx-filename-extension": ["warn", { extensions: [".ts", ".tsx"] }],
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          arrowParens: "avoid",
          endOfLine: "auto",
          printWidth: 180,
        },
      ],
      "react/react-in-jsx-scope": "off",
      "no-use-before-define": "off",
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-use-before-define": "error",
      "import/extensions": ["error", "never", { png: "always", jpg: "always", webp: "always" }],
      "react/prop-types": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "import/prefer-default-export": "off",
      "global-require": "off",
      "no-plusplus": "off",
      "no-fallthrough": "off",
      "no-empty": "off",
      "no-constant-condition": "off",
      "no-control-regex": "off",
      "no-misleading-character-class": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
      "no-cond-assign": "off",
      "no-unreachable": "off",
      "getter-return": "off",
      "valid-typeof": "off"
    },
  },
  {
    files: ["src/translations/**/*.ts"],
    rules: {
      "prettier/prettier": "off",
    },
  },
  {
    files: ["src/env/**/*.js"],
    languageOptions: {
      globals: {
        module: "readonly",
        exports: "readonly"
      }
    },
    rules: {
      "react/function-component-definition": "off"
    }
  }
];