import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://pelaporan-d3ti.my.id',
        changeOrigin: true,
        secure: false
      }
    }
  }
})