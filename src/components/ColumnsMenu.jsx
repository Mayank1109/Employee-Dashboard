import { useEffect, useRef, useState } from 'react'

export default function ColumnsMenu({ columns, hidden, onToggle }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="menu" ref={ref}>
      <button className="btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Columns
      </button>
      {open && (
        <div className="menu__panel" role="group" aria-label="Show or hide columns">
          {columns.map((c) => (
            <label key={c.id} className="menu__item">
              <input type="checkbox" checked={!hidden.includes(c.id)} onChange={(e) => onToggle(c.id, e.target.checked)} />
              {c.name}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
