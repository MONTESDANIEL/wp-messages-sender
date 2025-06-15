import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/main.css'
import App from './pages/App'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />
    <App />
    <Footer />
  </StrictMode>,
)
