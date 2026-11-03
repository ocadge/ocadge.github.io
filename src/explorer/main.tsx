import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import Explorer from './Explorer.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('index.html is missing <div id="root">')

createRoot(root).render(
  <StrictMode>
    <main>
      <p>
        <a href="/">&larr; Back to portfolio</a>
      </p>
      <Explorer />
    </main>
  </StrictMode>,
)
