import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'fs'
// https://vite.dev/config/
import dotenv from 'dotenv'
import config from './../config'
dotenv.config({ path: './../../.env' })
export default defineConfig({
  plugins: [svelte()],
  build: { outDir: "./../../build/static" },
  server: {
    port: config.https ? 443 : 3000,
    https: config.https
      ? {
        key: readFileSync('./../../ssl/key.pem', 'utf-8'),
        cert: readFileSync('./../../ssl/cert.pem', 'utf-8')
      }
      : undefined
  }
})
