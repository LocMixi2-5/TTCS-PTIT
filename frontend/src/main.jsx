import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'

// Apply saved theme immediately before first render to avoid flash
const saved = JSON.parse(localStorage.getItem('theme-preference') || '{}');
const isDark = saved?.state?.isDark !== false; // default dark
if (!isDark) document.documentElement.classList.add('light');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        theme={isDark ? 'dark' : 'light'}
        richColors
      />
    </BrowserRouter>
  </StrictMode>,
)
