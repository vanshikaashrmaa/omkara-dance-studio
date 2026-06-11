import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useStudio } from '../context/StudioContext'

const EMPTY = {
  name: '', age: '', package: 'dance',
  feesAmount: '', duration: '3 months',
  feeStatus: 'paid', lastPaidDate: '', dueDays: 0
}

export default function AddStudentModal({ onClose, onSuccess }) {
  const { addStudent } = useStudio()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required.')
    if (!form.age || isNaN(form.age)) return setError('Enter a valid age.')
    if (!form.feesAmount || isNaN(form.feesAmount)) return setError('Enter a valid fees amount.')
    setError('')
    const id = addStudent({ ...form, age: Number(form.age), feesAmount: Number(form.feesAmount) })
    onSuccess?.(id)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">Add Student</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="fee-alert danger" style={{ marginBottom: 16 }}>{error}</div>
          )}

          <div className="form-grid">
            <div className="input-group full-width">
              <label className="input-label">Full name</label>
              <input className="input" placeholder="e.g. Priya Sharma" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Age</label>
              <input className="input" type="number" placeholder="16" value={form.age}
                onChange={e => set('age', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Package</label>
              <select className="select-input" value={form.package} onChange={e => set('package', e.target.value)}>
                <option value="dance">Dance</option>
                <option value="fitness">Fitness</option>
                <option value="modeling">Modeling</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Fees amount (₹)</label>
              <input className="input" type="number" placeholder="3500" value={form.feesAmount}
                onChange={e => set('feesAmount', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Course duration</label>
              <select className="select-input" value={form.duration} onChange={e => set('duration', e.target.value)}>
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>12 months</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Fee status</label>
              <select className="select-input" value={form.feeStatus} onChange={e => set('feeStatus', e.target.value)}>
                <option value="paid">Paid</option>
                <option value="late">Late (paid with delay)</option>
                <option value="overdue">Overdue (not paid)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Last paid date</label>
              <input className="input" type="date" value={form.lastPaidDate}
                onChange={e => set('lastPaidDate', e.target.value)} />
            </div>

            {form.feeStatus !== 'paid' && (
              <div className="input-group">
                <label className="input-label">Days overdue</label>
                <input className="input" type="number" placeholder="0" value={form.dueDays}
                  onChange={e => set('dueDays', e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Student</button>
        </div>
      </div>
    </div>
  )
}
