import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    ignores: ['*.config.ts', 'package.json', 'pnpm-lock.yaml'],
  },
];
