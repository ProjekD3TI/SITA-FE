import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://pelaporan-d3ti.my.id',
        target: 'https://v3422040.mhs.d3tiuns.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})