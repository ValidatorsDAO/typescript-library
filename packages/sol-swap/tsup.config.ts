import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  bundle: true,
  minify: true,
  sourcemap: true,
  clean: true,
  dts: true,
  external: [
  ],
})
