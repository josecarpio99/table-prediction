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
        'serie-a-table-prediction-2023-2024': resolve(__dirname, 'serie-a-table-prediction-2023-2024/', 'index.html'),
        'premier-league-table-prediction-2023-2024': resolve(__dirname, 'premier-league-table-prediction-2023-2024/', 'index.html'),
      },
    },
  },
})