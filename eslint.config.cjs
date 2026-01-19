const { defineConfig, globalIgnores } = require('eslint/config');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const _import = require('eslint-plugin-import');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const { fixupPluginRules, fixupConfigRules } = require('@eslint/compat');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = defineConfig([
  // 1. Global Ignores
  globalIgnores(['**/dist/**/*', '**/node_modules/**/*', 'coverage/**/*']),

  // 2. Wrap legacy "extends" in fixupConfigRules and spread them into the array
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'prettier',
    ),
  ),

  // 3. Your Custom Project Rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: fixupPluginRules(_import),
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
