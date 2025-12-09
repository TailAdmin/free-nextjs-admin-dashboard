// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextConfig from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextConfig,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
])
