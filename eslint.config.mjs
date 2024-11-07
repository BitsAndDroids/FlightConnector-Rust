import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import storybook from "eslint-plugin-storybook";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import _import from "eslint-plugin-import";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/build/",
      "**/coverage/",
      "**/storybook-static/",
      "**/**.config.ts",
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      "plugin:storybook/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:import/errors",
      "prettier",
    ),
  ),
  {
    plugins: {
      storybook: fixupPluginRules(storybook),
      react: fixupPluginRules(react),
      "react-hooks": fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
      vitest,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: "**/tsconfig.json",
      },
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
];
