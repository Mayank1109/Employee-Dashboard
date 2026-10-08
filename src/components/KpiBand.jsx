import { formatCompactUsd, formatInt } from '../utils/format.js'

export default function KpiBand({ stats, total }) {
  const avg = (sum) => (stats.count ? sum / stats.count : 0)
  const items = [
    {
      label: 'Employees',
      value: formatInt(stats.count),
      note: stats.count === total ? 'all shown' : `of ${formatInt(total)}`,
    },
    {
      label: 'Active',
      value: stats.count ? `${Math.round((stats.active / stats.count) * 100)}%` : '0%',
      note: `${formatInt(stats.active)} people`,
    },
    {
      label: 'Average salary',
      value: formatCompactUsd(avg(stats.salary)),
      note: `${formatCompactUsd(stats.salary)} total`,
    },
    {
      label: 'Average rating',
      value: avg(stats.rating).toFixed(2),
      note: 'out of 5',
    },
    {
      label: 'Projects completed',
      value: formatInt(stats.projects),
      note: `${avg(stats.projects).toFixed(1)} per person`,
    },
  ]
  return (
    <dl className="kpis" aria-live="polite">
      {items.map((k) => (
        <div className="kpi" key={k.label}>
          <dt>{k.label}</dt>
          <dd>{k.value}</dd>
          <span className="kpi__note">{k.note}</span>
        </div>
      ))}
    </dl>
  )
}
