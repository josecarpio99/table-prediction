import { resolve } from 'path'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  alias:{
    '@' : path.resolve(__dirname)
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'serie-a-table-prediction-2023-2024': resolve(__dirname, 'serie-a-table-prediction-2023-2024/', 'index.html'),
      },
    },
  },
})