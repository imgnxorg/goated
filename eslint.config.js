//#!/usr/bin/env node

import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  {
    linterOptions: {
      reportUnusedInlineConfigs: "error",
    },
  },
  // prettier-ignore
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  // prettier-ignore
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  // prettier-ignore
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  // prettier-ignore
  tseslint.configs.recommended,
  // prettier-ignore
  pluginReact.configs.flat.recommended,
  // Removed the misplaced 'lib' property as it is not valid in this context
]);
