import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, IndianRupee, X } from 'lucide-react'
import { useStudio } from '../context/StudioContext'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Students',  icon: Users,           path: '/students' },
  { label: 'Fees',      icon: IndianRupee,      path: '/fees' },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { stats } = useStudio()

  const alertCount = stats.late + stats.overdue

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-logo">
        <div className="name">Omkara</div>
        <div className="sub">Dance Studio</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
          return (
            <button
              key={path}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => { navigate(path); onClose?.() }}
            >
              <Icon size={17} />
              {label}
              {label === 'Fees' && alertCount > 0 && (
                <span className="nav-badge">{alertCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      <button className="nav-item" style={{ marginTop: 'auto', marginBottom: '16px' }} onClick={onClose}>
        {open && <><X size={17} /> Close menu</>}
      </button>
    </aside>
  )
}
