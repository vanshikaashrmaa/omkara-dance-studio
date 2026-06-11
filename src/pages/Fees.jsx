import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { useStudio } from '../context/StudioContext'
import { FeeBadge, PkgBadge, initials, fmtDate, fmtAmount } from '../components/Helpers'

export default function Fees() {
  const { students, updateStudent } = useStudio()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const filtered = students.filter(s =>
    filter === 'all' ? true : s.feeStatus === filter
  ).sort((a, b) => (b.dueDays || 0) - (a.dueDays || 0))

  const markPaid = (e, s) => {
    e.stopPropagation()
    updateStudent(s.id, { feeStatus: 'paid', lastPaidDate: new Date().toISOString().split('T')[0], dueDays: 0 })
  }

  const totalDue = students
    .filter(s => s.feeStatus !== 'paid')
    .reduce((a, s) => a + Number(s.feesAmount), 0)

  return (
    <div>
      <div className="page-header">
        <h1>Fees</h1>
        <p>Track and manage student payments</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total due', value: fmtAmount(totalDue), color: 'var(--danger)', bg: 'var(--danger-bg)' },
          { label: 'Overdue students', value: students.filter(s=>s.feeStatus==='overdue').length, color: 'var(--danger)', bg: 'var(--danger-bg)' },
          { label: 'Late payments', value: students.filter(s=>s.feeStatus==='late').length, color: 'var(--warn)', bg: 'var(--warn-bg)' },
          { label: 'Paid this cycle', value: students.filter(s=>s.feeStatus==='paid').length, color: 'var(--success)', bg: 'var(--success-bg)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="stat-card" style={{ borderLeft: `2px solid ${color}` }}>
            <div className="stat-value" style={{ color, fontSize: 22 }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        {['all','overdue','late','paid'].map(f => (
          <button
            key={f}
            className="btn btn-sm btn-ghost"
            style={filter === f ? { borderColor: 'var(--border-focus)', color: 'var(--gold)', background: 'var(--gold-dim)' } : {}}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table-style list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                {['Student', 'Package', 'Amount', 'Status', 'Last paid', 'Days', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/students/${s.id}`)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: s.feeStatus === 'overdue'
                      ? 'rgba(224,82,82,0.03)'
                      : s.feeStatus === 'late'
                      ? 'rgba(232,165,58,0.03)'
                      : 'transparent'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = s.feeStatus === 'overdue' ? 'rgba(224,82,82,0.03)' : s.feeStatus === 'late' ? 'rgba(232,165,58,0.03)' : 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="student-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials(s.name)}</div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Age {s.age}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PkgBadge pkg={s.package} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{fmtAmount(s.feesAmount)}</td>
                  <td style={{ padding: '12px 16px' }}><FeeBadge status={s.feeStatus} dueDays={s.dueDays} /></td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{fmtDate(s.lastPaidDate)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {s.dueDays > 0
                      ? <span style={{ fontSize: 13, fontWeight: 600, color: s.feeStatus === 'overdue' ? 'var(--danger)' : 'var(--warn)' }}>{s.dueDays}d</span>
                      : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                    {s.feeStatus !== 'paid' && (
                      <button className="btn btn-sm" onClick={e => markPaid(e, s)}
                        style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(76,175,130,0.2)', fontSize: 12 }}>
                        <CheckCircle2 size={13} /> Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
