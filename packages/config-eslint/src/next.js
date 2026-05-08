import reactInternal from './react-internal.js';

export default [
  ...reactInternal,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
