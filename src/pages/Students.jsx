import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useStudio } from '../context/StudioContext'
import { FeeBadge, PkgBadge, initials, fmtAmount } from '../components/Helpers'
import AddStudentModal from '../components/AddStudentModal'

export default function Students() {
  const { students } = useStudio()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase())
    const matchFilter = filter === 'all' || s.package === filter || s.feeStatus === filter
    return matchQuery && matchFilter
  })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Students</h1>
          <p>{students.length} enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add student
        </button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} />
          <input
            className="search-input"
            placeholder="Search by name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {['all','dance','fitness','modeling','paid','late','overdue'].map(f => (
          <button
            key={f}
            className={`btn btn-sm btn-ghost`}
            style={filter === f ? { borderColor: 'var(--border-focus)', color: 'var(--gold)', background: 'var(--gold-dim)' } : {}}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={40} />
          <p>No students found</p>
        </div>
      ) : (
        <div className="students-grid">
          {filtered.map(s => (
            <div
              key={s.id}
              className={`student-card fees-${s.feeStatus}`}
              onClick={() => navigate(`/students/${s.id}`)}
            >
              <div className="student-card-header">
                <div className="student-avatar">{initials(s.name)}</div>
                <div className="student-card-info">
                  <div className="name">{s.name}</div>
                  <div className="meta">Age {s.age} · {s.duration}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                <PkgBadge pkg={s.package} />
                <FeeBadge status={s.feeStatus} dueDays={s.dueDays} />
              </div>

              <div className="student-card-body">
                <div className="info-chip">
                  <div className="chip-label">Fees</div>
                  <div className="chip-value">{fmtAmount(s.feesAmount)}</div>
                </div>
                <div className="info-chip">
                  <div className="chip-label">Duration</div>
                  <div className="chip-value">{s.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
