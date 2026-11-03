import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Two pages: the portfolio itself, and the explorer demo, so the chart library
    // only loads for people who open the explorer.
    rollupOptions: {
      input: { main: 'index.html', explorer: 'explorer/index.html' },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
