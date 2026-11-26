import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/proyecto03-dashboard-interactivo/',
  plugins: [react()],
})
