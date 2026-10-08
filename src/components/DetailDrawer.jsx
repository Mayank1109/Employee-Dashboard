import { useEffect, useMemo, useRef } from 'react'
import { deptColor, formatDate, formatUsd, initials, tenure } from '../utils/format.js'

export default function DetailDrawer({ employee, rows, onClose, onOpen }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!employee) return
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [employee, onClose])

  const manager = useMemo(
    () => (employee?.manager ? rows.find((r) => r.fullName === employee.manager) : null),
    [employee, rows]
  )
  const reports = useMemo(() => {
    if (!employee) return { list: [], total: 0 }
    const out = []
    let total = 0
    for (const r of rows) {
      if (r.manager === employee.fullName && r.id !== employee.id) {
        total++
        if (out.length < 5) out.push(r)
      }
    }
    return { list: out, total }
  }, [employee, rows])

  if (!employee) return null
  const e = employee

  return (
    <aside className="drawer" role="dialog" aria-label={`${e.fullName} details`}>
      <header className="drawer__head">
        <span className="avatar avatar--lg" style={{ background: deptColor(e.department) }} aria-hidden="true">
          {initials(e)}
        </span>
        <div>
          <h2>{e.fullName}</h2>
          <p>{e.position}, {e.department}</p>
        </div>
        <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Close details">×</button>
      </header>

      <dl className="drawer__facts">
        <div><dt>Email</dt><dd>{e.email}</dd></div>
        <div><dt>Location</dt><dd>{e.location}</dd></div>
        <div><dt>Hired</dt><dd>{formatDate(e.hireDate)} <span className="muted">({tenure(e.hireDate)})</span></dd></div>
        <div><dt>Age</dt><dd>{e.age}</dd></div>
        <div><dt>Salary</dt><dd>{formatUsd(e.salary)}</dd></div>
        <div><dt>Rating</dt><dd>{e.performanceRating.toFixed(1)} / 5</dd></div>
        <div><dt>Projects completed</dt><dd>{e.projectsCompleted}</dd></div>
        <div><dt>Status</dt><dd>{e.isActive ? 'Active' : 'Inactive'}</dd></div>
      </dl>

      <section>
        <h3>Skills</h3>
        <div className="chips chips--wrap">
          {e.skills.map((s) => <span className="chip" key={s}>{s}</span>)}
        </div>
      </section>

      <section>
        <h3>Reports to</h3>
        {e.manager ? (
          manager ? (
            <button className="person-link" onClick={() => onOpen(manager.id)}>{manager.fullName}<span className="muted">{manager.position}</span></button>
          ) : (
            <p>{e.manager}</p>
          )
        ) : (
          <p className="muted">Top of the reporting line</p>
        )}
      </section>

      {reports.total > 0 && (
        <section>
          <h3>Direct reports ({reports.total})</h3>
          <ul className="people">
            {reports.list.map((r) => (
              <li key={r.id}>
                <button className="person-link" onClick={() => onOpen(r.id)}>{r.fullName}<span className="muted">{r.position}</span></button>
              </li>
            ))}
          </ul>
          {reports.total > reports.list.length && (
            <p className="muted">and {reports.total - reports.list.length} more</p>
          )}
        </section>
      )}
    </aside>
  )
}
