// Shapes raw JSON records into the row model the grid uses.
// Dates become Date objects so AG Grid's date filter and sorting work natively.
export function prepareRow(e) {
  return {
    ...e,
    fullName: `${e.firstName} ${e.lastName}`,
    hireDate: new Date(`${e.hireDate}T00:00:00`),
  }
}
