// spell-checker:ignore eqeqeq tseslint

import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// import jestPlugin from 'eslint-plugin-jest';

/**
 * This error will appear when using a node version earlier than v18.x:
 * ConfigError: Config (unnamed): Key "rules": Key "constructor-super": structuredClone is not defined
 */
/* eslint-disable-next-line no-undef */
if (!process?.versions?.node || Number(process?.versions?.node.split('.')[0]) < 18) {
  throw new Error('Node version must be >= 18.0.0');
}

/* eslint-disable-next-line no-undef */
module.exports = tseslint.config(
  {
    // An empty config object with only the `ignores` key - is equal to `.eslintignore`, i.e. it ignores these files
    ignores: [
      '**/node_modules/**/*',
      '*.env.*',
      '!.env.example',

      '**/dist/**/*',
      'tsconfig.tsbuildinfo',
      '*firebaseAuthServiceAccount*.json',
      '**/coverage/**/*',
      '**/.next/**/*',
      '**/out/**/*',

      'eslint.config.ts',
      'eslint.config.js',
      '**/next.config.js',
      '**/*.js',
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      // jest: jestPlugin,
    },
    // ignores: [
    //   '**/next.config.js',
    // ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
      globals: { ...globals.jest, ...globals.node, test_withCleanDB: true, describe_withCleanDb: true },
    },
    rules: {
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
  {
    //   extends: [, 'next', 'plugin:@typescript-eslint/recommended', 'plugin:@next/next/recommended'],
    // processor: '@typescript-eslint/parser',
    //   parserOptions: {
    //     ecmaVersion: 12,
    //     sourceType: 'module',
    //     project: ['./tsconfig.base.json', './apps/*/tsconfig.json'],
    //   },

    //   ignorePatterns: [],
    //   plugins: ['@typescript-eslint', 'jest-extended'],
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      eqeqeq: 'off',
      'no-case-declarations': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-console': 'off',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],
    },
  },
  {
    files: ['**/*'],
    rules: {
      'no-trailing-spaces': 'error',
    },
  }
);
