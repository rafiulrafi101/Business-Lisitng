import js from '@eslint/js';
import pluginPromise from 'eslint-plugin-promise';
import pluginN from 'eslint-plugin-n';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'collections/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      promise: pluginPromise,
      n: pluginN,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginPromise.configs.recommended.rules,
      ...pluginN.configs.recommended.rules,
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-missing-require': 'off',
      'n/no-process-exit': 'off',
      'promise/no-callback-in-promise': 'off',
    },
  },
];
