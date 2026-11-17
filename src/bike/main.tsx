import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
// The page layout and panels are shared with the explorer.
import '../explorer/explorer.css'
import './bike.css'
import Workshop from './Workshop.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('index.html is missing <div id="root">')

createRoot(root).render(
  <StrictMode>
    <main className="explorer">
      <p>
        <a href="/">&larr; Back to portfolio</a>
      </p>
      <Workshop />
    </main>
  </StrictMode>,
)
