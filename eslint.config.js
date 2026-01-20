import js from "@eslint/js";
import ts from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  unicorn.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname, 
      },
    },
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 40,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "unicorn/prevent-abbreviations": "warn",
      "unicorn/no-null": "warn",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/no-array-for-each": "warn",
      "unicorn/no-useless-undefined": "error",
      "no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1],
          ignoreArrayIndexes: true,
        },
      ],
    },
  },
];