import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './kanoa-tokens.css'
import './foundation.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
