import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(
    {
      script: {
        defineOptions: true, // Aktifkan fitur defineOptions
      },
    }
  )],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ mengarah ke folder src
    },
  },
})
