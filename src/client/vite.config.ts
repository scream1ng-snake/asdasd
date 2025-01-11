import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'fs'
// https://vite.dev/config/

const devHttps = true
export default defineConfig({
  plugins: [svelte()],
  build: { outDir: "./../../build/static" },
  server: {
    https: devHttps 
      ? {
        key: readFileSync('./../../ssl/key.pem', 'utf-8'),
        cert: readFileSync('./../../ssl/cert.pem', 'utf-8')
      }
      : undefined
  }
})
