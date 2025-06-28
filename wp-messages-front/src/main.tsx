import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/main.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BulkMessaging from './pages/BulkMessaging'
import Status from './pages/StatusPublisher'
import Queue from './pages/Queue'
import { SmallNavBar, NavBar } from './components/NavBar'
import Footer from './components/Footer'
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Instances from './pages/Instances';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      {window.location.pathname === '/login' || window.location.pathname === '/forgot-password' ? (
        <SmallNavBar />
      ) : (
        <NavBar />
      )}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bulkMessaging" element={<BulkMessaging />} />
        <Route path="/statusPublisher" element={<Status />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  </StrictMode>,
)
