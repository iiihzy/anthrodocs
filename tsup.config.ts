import { defineConfig } from 'tsup'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'

export default defineConfig({
  entry: {
    anthrodocs: 'anthrodocs.ts',
    server: 'server.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: true,
  external: ['react', 'react-dom', 'next', 'js-yaml', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  tsconfig: './tsconfig.build.json',
  onSuccess: async () => {
    copyFileSync('styles.css', 'dist/styles.css')

    const clientPath = 'dist/anthrodocs.js'
    const clientContent = readFileSync(clientPath, 'utf-8')
    if (!clientContent.startsWith('"use client"')) {
      writeFileSync(clientPath, `"use client";\n${clientContent}`)
    }
  },
})