import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// What the pages may load. Only added to the built site: the dev server needs inline scripts for hot reload.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  'form-action https://formspree.io',
  "base-uri 'none'",
  "object-src 'none'",
].join('; ')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp',
      apply: 'build',
      // head-prepend: a CSP meta tag only covers what comes after it in the page.
      transformIndexHtml: () => [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ],
    },
  ],
  build: {
    // The portfolio, the explorer demo (so the chart library only loads for people who
    // open it), the bike workshop demo and the 404 page GitHub Pages shows for unknown addresses.
    rollupOptions: {
      input: {
        main: 'index.html',
        explorer: 'explorer/index.html',
        bike: 'bike/index.html',
        notFound: '404.html',
      },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
