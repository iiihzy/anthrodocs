import { defineConfig } from 'tsup'
import { copyFileSync } from 'fs'

export default defineConfig({
  entry: ['anthrodocs.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'js-yaml'],
  tsconfig: './tsconfig.build.json',
  onSuccess: async () => {
    copyFileSync('styles.css', 'dist/styles.css')
  },
})