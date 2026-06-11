import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, X, Edit2, Check } from 'lucide-react'
import { useStudio } from '../context/StudioContext'
import { FeeBadge, PkgBadge, initials, fmtDate, fmtAmount } from '../components/Helpers'

export default function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getStudent, updateStudent, deleteStudent, addNote, deleteNote, updatePerformance } = useStudio()

  const s = getStudent(id)
  const [noteText, setNoteText] = useState('')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editingPerf, setEditingPerf] = useState(false)
  const [perfEdit, setPerfEdit] = useState({})

  if (!s) return (
    <div className="empty-state">
      <p>Student not found.</p>
      <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/students')}>Back</button>
    </div>
  )

  const handleDelete = () => {
    if (confirm(`Delete ${s.name}? This cannot be undone.`)) {
      deleteStudent(id)
      navigate('/students')
    }
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addNote(id, noteText.trim())
    setNoteText('')
  }

  const startEdit = () => {
    setEditForm({ name: s.name, age: s.age, package: s.package, feesAmount: s.feesAmount, duration: s.duration, feeStatus: s.feeStatus, lastPaidDate: s.lastPaidDate, dueDays: s.dueDays || 0 })
    setEditing(true)
  }

  const saveEdit = () => {
    updateStudent(id, { ...editForm, age: Number(editForm.age), feesAmount: Number(editForm.feesAmount), dueDays: Number(editForm.dueDays) })
    setEditing(false)
  }

  const startPerfEdit = () => {
    setPerfEdit({ ...s.performance })
    setEditingPerf(true)
  }

  const savePerf = () => {
    const cleaned = Object.fromEntries(Object.entries(perfEdit).map(([k,v]) => [k, Math.min(100, Math.max(0, Number(v)))]))
    updatePerformance(id, cleaned)
    setEditingPerf(false)
  }

  const feeAlertType = s.feeStatus === 'overdue' ? 'danger' : s.feeStatus === 'late' ? 'warn' : 'success'
  const feeAlertMsg =
    s.feeStatus === 'overdue' ? `Fees overdue by ${s.dueDays || '?'} days. Last payment: ${fmtDate(s.lastPaidDate)}` :
    s.feeStatus === 'late'    ? `Fees were paid ${s.dueDays || '?'} days late. Last payment: ${fmtDate(s.lastPaidDate)}` :
    `Fees paid on time. Last payment: ${fmtDate(s.lastPaidDate)}`

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/students')}>
        <ArrowLeft size={14} /> Back to students
      </button>

      {/* Fee alert banner */}
      <div className={`fee-alert ${feeAlertType}`}>
        <FeeBadge status={s.feeStatus} dueDays={s.dueDays} />
        <span>{feeAlertMsg}</span>
      </div>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials(s.name)}</div>
        <div className="profile-meta" style={{ flex: 1 }}>
          {editing ? (
            <div className="form-grid" style={{ marginBottom: 0 }}>
              <div className="input-group full-width">
                <label className="input-label">Name</label>
                <input className="input" value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">Age</label>
                <input className="input" type="number" value={editForm.age} onChange={e => setEditForm(f => ({...f, age: e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">Package</label>
                <select className="select-input" value={editForm.package} onChange={e => setEditForm(f => ({...f, package: e.target.value}))}>
                  <option value="dance">Dance</option>
                  <option value="fitness">Fitness</option>
                  <option value="modeling">Modeling</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Fees (₹)</label>
                <input className="input" type="number" value={editForm.feesAmount} onChange={e => setEditForm(f => ({...f, feesAmount: e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">Duration</label>
                <select className="select-input" value={editForm.duration} onChange={e => setEditForm(f => ({...f, duration: e.target.value}))}>
                  <option>1 month</option><option>3 months</option><option>6 months</option><option>12 months</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Fee status</label>
                <select className="select-input" value={editForm.feeStatus} onChange={e => setEditForm(f => ({...f, feeStatus: e.target.value}))}>
                  <option value="paid">Paid</option>
                  <option value="late">Late</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Last paid date</label>
                <input className="input" type="date" value={editForm.lastPaidDate} onChange={e => setEditForm(f => ({...f, lastPaidDate: e.target.value}))} />
              </div>
              {editForm.feeStatus !== 'paid' && (
                <div className="input-group">
                  <label className="input-label">Days overdue</label>
                  <input className="input" type="number" value={editForm.dueDays} onChange={e => setEditForm(f => ({...f, dueDays: e.target.value}))} />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="student-name">{s.name}</div>
              <div className="badges">
                <PkgBadge pkg={s.package} />
                <FeeBadge status={s.feeStatus} dueDays={s.dueDays} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Joined {fmtDate(s.joinDate)}</span>
              </div>
              <div className="profile-details-grid">
                {[
                  { label: 'Age', value: `${s.age} years` },
                  { label: 'Package', value: s.package.charAt(0).toUpperCase() + s.package.slice(1) },
                  { label: 'Fees', value: fmtAmount(s.feesAmount) },
                  { label: 'Duration', value: s.duration },
                ].map(({ label, value }) => (
                  <div className="detail-chip" key={label}>
                    <div className="label">{label}</div>
                    <div className="value">{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignSelf: 'flex-start' }}>
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={saveEdit}><Check size={14} /> Save</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}><X size={14} /></button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={startEdit}><Edit2 size={14} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}><Trash2 size={14} /></button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Performance */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p className="section-title" style={{ marginBottom: 0 }}>Performance</p>
            {editingPerf ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-primary btn-sm" onClick={savePerf}><Check size={13} /> Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingPerf(false)}><X size={13} /></button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={startPerfEdit}><Edit2 size={13} /> Update</button>
            )}
          </div>

          {Object.entries(s.performance).map(([skill, score]) => (
            <div className="perf-row" key={skill}>
              <span className="perf-skill">{skill}</span>
              {editingPerf ? (
                <input
                  type="number" min="0" max="100"
                  className="input"
                  style={{ width: 70, padding: '4px 8px', fontSize: 13 }}
                  value={perfEdit[skill] ?? score}
                  onChange={e => setPerfEdit(p => ({...p, [skill]: e.target.value}))}
                />
              ) : (
                <>
                  <div className="perf-bar-track">
                    <div className="perf-bar-fill" style={{ width: `${score}%` }} />
                  </div>
                  <span className="perf-score">{score}</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: 14 }}>Notes</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <textarea
              className="textarea-input"
              placeholder="Add a note about this student…"
              value={noteText}
              rows={2}
              style={{ minHeight: 60, flex: 1 }}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAddNote()}
            />
            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleAddNote}>
              <Plus size={15} />
            </button>
          </div>

          {s.notes.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No notes yet.</p>
          ) : (
            <div className="notes-list">
              {s.notes.map(n => (
                <div className="note-item" key={n.id}>
                  <div className="note-date">{new Date(n.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="note-text">{n.text}</div>
                  <div className="note-footer">
                    <span />
                    <button className="btn btn-danger btn-sm" onClick={() => deleteNote(id, n.id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
