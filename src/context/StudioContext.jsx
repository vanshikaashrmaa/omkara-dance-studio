import React, { createContext, useContext, useState, useEffect } from 'react'

const StudioContext = createContext(null)

const SAMPLE_STUDENTS = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 16,
    package: 'dance',
    feesAmount: 3500,
    duration: '6 months',
    joinDate: '2025-01-10',
    feeStatus: 'paid',
    lastPaidDate: '2026-06-01',
    dueDays: 0,
    performance: { Rhythm: 85, Posture: 90, Expression: 78, Flexibility: 82 },
    notes: [
      { id: 'n1', date: '2026-05-20T10:00:00', text: 'Excellent progress in Kathak footwork. Ready for the annual recital.' },
      { id: 'n2', date: '2026-04-15T10:00:00', text: 'Needs to work on upper body posture during fast sequences.' }
    ]
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    age: 22,
    package: 'fitness',
    feesAmount: 2800,
    duration: '3 months',
    joinDate: '2025-03-01',
    feeStatus: 'late',
    lastPaidDate: '2026-05-05',
    dueDays: 36,
    performance: { Stamina: 70, Strength: 65, Flexibility: 55, Coordination: 60 },
    notes: [
      { id: 'n3', date: '2026-05-10T10:00:00', text: 'Attendance inconsistent. Needs motivation. Discuss schedule flexibility.' }
    ]
  },
  {
    id: '3',
    name: 'Ananya Patel',
    age: 19,
    package: 'modeling',
    feesAmount: 5000,
    duration: '12 months',
    joinDate: '2024-12-01',
    feeStatus: 'overdue',
    lastPaidDate: '2026-03-01',
    dueDays: 101,
    performance: { Posture: 88, Runway: 80, Expression: 92, Confidence: 76 },
    notes: []
  },
  {
    id: '4',
    name: 'Karan Singh',
    age: 14,
    package: 'dance',
    feesAmount: 3000,
    duration: '6 months',
    joinDate: '2026-01-15',
    feeStatus: 'paid',
    lastPaidDate: '2026-06-08',
    dueDays: 0,
    performance: { Rhythm: 72, Posture: 68, Expression: 80, Flexibility: 90 },
    notes: []
  }
]

export function StudioProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const stored = localStorage.getItem('omkara_students')
      return stored ? JSON.parse(stored) : SAMPLE_STUDENTS
    } catch {
      return SAMPLE_STUDENTS
    }
  })

  useEffect(() => {
    localStorage.setItem('omkara_students', JSON.stringify(students))
  }, [students])

  const addStudent = (data) => {
    const student = {
      ...data,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      performance: getDefaultPerformance(data.package),
      notes: [],
      dueDays: 0,
    }
    setStudents(prev => [student, ...prev])
    return student.id
  }

  const updateStudent = (id, data) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const addNote = (studentId, text) => {
    const note = { id: Date.now().toString(), date: new Date().toISOString(), text }
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, notes: [note, ...s.notes] } : s
    ))
  }

  const deleteNote = (studentId, noteId) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, notes: s.notes.filter(n => n.id !== noteId) } : s
    ))
  }

  const updatePerformance = (studentId, performance) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, performance } : s
    ))
  }

  const getStudent = (id) => students.find(s => s.id === id)

  const stats = {
    total: students.length,
    paid: students.filter(s => s.feeStatus === 'paid').length,
    late: students.filter(s => s.feeStatus === 'late').length,
    overdue: students.filter(s => s.feeStatus === 'overdue').length,
    revenue: students.filter(s => s.feeStatus === 'paid').reduce((a, s) => a + Number(s.feesAmount), 0),
    byPackage: {
      dance: students.filter(s => s.package === 'dance').length,
      fitness: students.filter(s => s.package === 'fitness').length,
      modeling: students.filter(s => s.package === 'modeling').length,
    }
  }

  return (
    <StudioContext.Provider value={{
      students, stats,
      addStudent, updateStudent, deleteStudent,
      addNote, deleteNote, updatePerformance, getStudent
    }}>
      {children}
    </StudioContext.Provider>
  )
}

export const useStudio = () => useContext(StudioContext)

function getDefaultPerformance(pkg) {
  if (pkg === 'dance')    return { Rhythm: 50, Posture: 50, Expression: 50, Flexibility: 50 }
  if (pkg === 'fitness')  return { Stamina: 50, Strength: 50, Flexibility: 50, Coordination: 50 }
  if (pkg === 'modeling') return { Posture: 50, Runway: 50, Expression: 50, Confidence: 50 }
  return {}
}
