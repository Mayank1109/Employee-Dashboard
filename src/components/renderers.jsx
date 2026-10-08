import { deptColor, initials } from '../utils/format.js'

export function EmployeeCell({ data }) {
  if (!data) return null
  return (
    <span className="cell-person">
      <span className="avatar" style={{ background: deptColor(data.department) }} aria-hidden="true">
        {initials(data)}
      </span>
      <span className="cell-person__name">{data.fullName}</span>
    </span>
  )
}

export function DepartmentCell({ value }) {
  if (!value) return null
  return (
    <span className="cell-dept">
      <span className="dot" style={{ background: deptColor(value) }} aria-hidden="true" />
      {value}
    </span>
  )
}

export function RatingCell({ value }) {
  if (value == null) return null
  return (
    <span className="cell-rating">
      <span className="cell-rating__num">{value.toFixed(1)}</span>
      <span className="cell-rating__track" aria-hidden="true">
        <span className="cell-rating__fill" style={{ width: `${(value / 5) * 100}%` }} />
      </span>
    </span>
  )
}

export function StatusCell({ value }) {
  const active = Boolean(value)
  return (
    <span className={`status ${active ? 'status--active' : 'status--inactive'}`}>
      <span className="dot" aria-hidden="true" />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export function SkillsCell({ value }) {
  if (!value?.length) return null
  const shown = value.slice(0, 2)
  const rest = value.length - shown.length
  return (
    <span className="chips">
      {shown.map((s) => (
        <span className="chip" key={s}>{s}</span>
      ))}
      {rest > 0 && <span className="chip chip--more" title={value.slice(2).join(', ')}>+{rest}</span>}
    </span>
  )
}
