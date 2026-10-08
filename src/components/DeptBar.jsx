import { deptColor, formatInt } from '../utils/format.js'

// A stacked headcount bar that doubles as the department filter.
export default function DeptBar({ counts, selected, onToggle, onClear }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, n]) => s + n, 0)
  const anySelected = selected.length > 0

  return (
    <section className="deptbar" aria-label="Headcount by department">
      <div className="deptbar__head">
        <h2>Headcount by department</h2>
        {anySelected && (
          <button className="link-btn" onClick={onClear}>Clear department filter</button>
        )}
      </div>
      <div className="deptbar__track" role="group" aria-label="Filter by department">
        {entries.map(([dept, n]) => {
          const on = selected.includes(dept)
          return (
            <button
              key={dept}
              className={`deptbar__seg ${anySelected && !on ? 'is-dim' : ''}`}
              style={{ flexGrow: n, background: deptColor(dept) }}
              aria-pressed={on}
              title={`${dept}: ${formatInt(n)}`}
              onClick={() => onToggle(dept)}
            >
              <span className="sr-only">{dept}</span>
            </button>
          )
        })}
      </div>
      <ul className="deptbar__legend">
        {entries.map(([dept, n]) => {
          const on = selected.includes(dept)
          return (
            <li key={dept}>
              <button
                className={`legend-item ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => onToggle(dept)}
              >
                <span className="dot" style={{ background: deptColor(dept) }} aria-hidden="true" />
                {dept}
                <span className="legend-item__n">
                  {formatInt(n)} <span className="legend-item__pct">({Math.round((n / total) * 100)}%)</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
