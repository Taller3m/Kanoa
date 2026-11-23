import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: el build funciona servido desde una subcarpeta (GitHub Pages: /Kanoa/). Las rutas usan #, así que no hace falta más.
export default defineConfig({ base: './', plugins: [react()] })
