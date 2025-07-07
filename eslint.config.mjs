import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/',
      '.next/**/*',
      'out/',
      'out/**/*',
      'build/',
      'build/**/*',
      'dist/',
      'dist/**/*',
      'node_modules/',
      'node_modules/**/*',
      'tests/',
      'tests/**/*',
      'tests-examples/',
      'tests-examples/**/*',
      'jsvectormap.d.ts',
    ],
  },
];

export default eslintConfig;
