import path from 'path'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.ts', './tests/**/*.{ts,tsx}'],
    includeSource: ['**/*.{ts,tsx}'],
    //reporters: ['html'],
  },
  resolve: {
    alias: [
      { find: 'lib', replacement: path.resolve(__dirname, 'lib') },
      { find: 'components', replacement: path.resolve(__dirname, 'components') },
      { find: 'hooks', replacement: path.resolve(__dirname, 'hooks') },
    ],
  },
})
