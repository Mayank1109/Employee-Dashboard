import { prepareRow } from './prepare.js'

// Deterministic PRNG so a given size always produces the same rows.
function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST = ['Aarav', 'Mia', 'Noah', 'Priya', 'Liam', 'Sofia', 'Ethan', 'Zara', 'Lucas', 'Ava', 'Omar', 'Chloe', 'Ravi', 'Nina', 'Diego', 'Hana']
const LAST = ['Patel', 'Nguyen', 'Kim', 'Silva', 'Cohen', 'Okafor', 'Larsen', 'Rossi', 'Khan', 'Murphy', 'Tanaka', 'Singh', 'Dubois', 'Ivanov', 'Reyes', 'Baker']

/**
 * Builds `count` rows by remixing the sample dataset: same departments,
 * positions, skills and managers, with new names and jittered numbers.
 * The first 20 rows are the original records, untouched.
 */
export function generateEmployees(base, count) {
  if (count <= base.length) return base.slice(0, count).map(prepareRow)
  const rand = mulberry32(count)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const rows = base.map(prepareRow)

  for (let i = base.length; i < count; i++) {
    const b = base[i % base.length]
    const firstName = pick(FIRST)
    const lastName = pick(LAST)
    const year = 2016 + Math.floor(rand() * 10)
    const month = 1 + Math.floor(rand() * 12)
    const day = 1 + Math.floor(rand() * 28)
    rows.push(
      prepareRow({
        ...b,
        id: i + 1,
        firstName,
        lastName,
        email: `${firstName}.${lastName}.${i + 1}@company.com`.toLowerCase(),
        salary: Math.round((b.salary * (0.85 + rand() * 0.3)) / 500) * 500,
        hireDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        age: Math.max(22, b.age + Math.round((rand() - 0.5) * 8)),
        performanceRating: Math.min(5, Math.max(3, Math.round((b.performanceRating + (rand() - 0.5)) * 10) / 10)),
        projectsCompleted: Math.max(1, b.projectsCompleted + Math.round((rand() - 0.5) * 8)),
        isActive: rand() > 0.1,
      })
    )
  }
  return rows
}
