const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const dateFmt = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const int = new Intl.NumberFormat('en-US')

export const formatUsd = (n) => (n == null ? '' : usd.format(n))
export const formatCompactUsd = (n) => (n == null ? '' : compactUsd.format(n))
export const formatDate = (d) => (d ? dateFmt.format(d) : '')
export const formatInt = (n) => int.format(n)

export function tenure(from, now = new Date()) {
  let months =
    (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth())
  if (now.getDate() < from.getDate()) months -= 1
  months = Math.max(0, months)
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  return m === 0 ? `${y} yr` : `${y} yr ${m} mo`
}

export const initials = (e) => `${e.firstName[0]}${e.lastName[0]}`

export const DEPT_COLORS = {
  Engineering: '#3A5A9B',
  Marketing: '#B5546B',
  Sales: '#B7791F',
  HR: '#3F8466',
  Finance: '#6B5BA8',
}
export const deptColor = (d) => DEPT_COLORS[d] ?? '#667085'
