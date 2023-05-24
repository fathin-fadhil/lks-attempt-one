import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/token': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/resources': 'http://localhost:3000',
      '/users': 'http://localhost:3000'
    }
  }
})
