import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2200)
    const t2 = setTimeout(() => onDone(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`loading-screen${fading ? ' fade-out' : ''}`} role="status" aria-label="Loading Omkara Dance Studio">
      <div className="loading-logo">
        <p className="welcome">Welcome to</p>
        <h1 className="studio-name">OMKARA<br />DANCE STUDIO</h1>
        <p className="studio-sub">Est. &nbsp; Jalandhar</p>
      </div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" />
      </div>
    </div>
  )
}
