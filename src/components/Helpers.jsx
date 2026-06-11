import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export function FeeBadge({ status, dueDays }) {
  if (status === 'paid')    return <span className="fee-badge paid"><CheckCircle2 size={12} />Paid</span>
  if (status === 'late')    return <span className="fee-badge late"><AlertTriangle size={12} />Late{dueDays ? ` · ${dueDays}d` : ''}</span>
  if (status === 'overdue') return <span className="fee-badge overdue"><XCircle size={12} />Overdue{dueDays ? ` · ${dueDays}d` : ''}</span>
  return null
}

export function PkgBadge({ pkg }) {
  const labels = { dance: 'Dance', fitness: 'Fitness', modeling: 'Modeling' }
  return <span className={`pkg-badge ${pkg}`}>{labels[pkg] || pkg}</span>
}

export function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function fmtDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

export function fmtAmount(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}
