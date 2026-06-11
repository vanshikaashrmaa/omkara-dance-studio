import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, IndianRupee, AlertTriangle, CheckCircle2, Music2, Dumbbell, Crown } from 'lucide-react'
import { useStudio } from '../context/StudioContext'
import { FeeBadge, PkgBadge, initials, fmtDate, fmtAmount } from '../components/Helpers'

export default function Dashboard() {
  const { students, stats } = useStudio()
  const navigate = useNavigate()

  const alerts = students.filter(s => s.feeStatus !== 'paid')
    .sort((a, b) => (b.dueDays || 0) - (a.dueDays || 0))

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of Omkara Dance Studio</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={17} /></div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total students</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle2 size={17} />
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.paid}</div>
          <div className="stat-label">Fees paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
            <AlertTriangle size={17} />
          </div>
          <div className="stat-value" style={{ color: 'var(--warn)' }}>{stats.late + stats.overdue}</div>
          <div className="stat-label">Pending fees</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IndianRupee size={17} /></div>
          <div className="stat-value" style={{ fontSize: 20 }}>{fmtAmount(stats.revenue)}</div>
          <div className="stat-label">Revenue collected</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Package breakdown */}
        <div className="card">
          <p className="section-title">By package</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { pkg: 'dance',    icon: Music2,    count: stats.byPackage.dance },
              { pkg: 'fitness',  icon: Dumbbell,  count: stats.byPackage.fitness },
              { pkg: 'modeling', icon: Crown,      count: stats.byPackage.modeling },
            ].map(({ pkg, icon: Icon, count }) => (
              <div key={pkg} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PkgBadge pkg={pkg} />
                <div style={{ flex: 1, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: stats.total ? `${(count / stats.total) * 100}%` : '0%',
                    background: pkg === 'dance' ? 'var(--gold)' : pkg === 'fitness' ? 'var(--success)' : '#c08de0',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 20, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="card">
          <p className="section-title">Fee status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Paid on time', count: stats.paid,    cls: 'paid' },
              { label: 'Paid late',    count: stats.late,    cls: 'late' },
              { label: 'Overdue',      count: stats.overdue, cls: 'overdue' },
            ].map(({ label, count, cls }) => (
              <div key={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <span className={`fee-badge ${cls}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <p className="section-title" style={{ marginBottom: 14 }}>
            Fee alerts ({alerts.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(s => (
              <div
                key={s.id}
                onClick={() => navigate(`/students/${s.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: s.feeStatus === 'overdue' ? 'var(--danger-bg)' : 'var(--warn-bg)',
                  border: `1px solid ${s.feeStatus === 'overdue' ? 'rgba(224,82,82,0.2)' : 'rgba(232,165,58,0.2)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div className="student-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                  {initials(s.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
                    Last paid: {fmtDate(s.lastPaidDate)}
                    {s.dueDays ? ` · ${s.dueDays} days ago` : ''}
                  </div>
                </div>
                <FeeBadge status={s.feeStatus} dueDays={s.dueDays} />
                <PkgBadge pkg={s.package} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
