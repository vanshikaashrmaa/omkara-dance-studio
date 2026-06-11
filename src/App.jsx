import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { StudioProvider } from './context/StudioContext'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import Fees from './pages/Fees'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!loaded) return <LoadingScreen onDone={() => setLoaded(true)} />

  return (
    <StudioProvider>
      <div className="app-shell">
        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
          <Menu size={20} />
        </button>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/students"      element={<Students />} />
            <Route path="/students/:id"  element={<StudentProfile />} />
            <Route path="/fees"          element={<Fees />} />
          </Routes>
        </main>
      </div>
    </StudioProvider>
  )
}
