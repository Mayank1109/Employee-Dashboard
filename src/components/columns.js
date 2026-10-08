import { formatUsd, formatDate } from '../utils/format.js'
import { formatSkills } from '../utils/skills.js'
import { EmployeeCell, DepartmentCell, RatingCell, StatusCell, SkillsCell } from './renderers.jsx'

// Date filter compares calendar days, ignoring any time component.
const dateComparator = (filterDate, cellValue) => {
  if (!cellValue) return -1
  const a = new Date(cellValue.getFullYear(), cellValue.getMonth(), cellValue.getDate()).getTime()
  const b = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime()
  return a === b ? 0 : a < b ? -1 : 1
}

export const columnDefs = [
  {
    colId: 'employee',
    headerName: 'Employee',
    field: 'fullName',
    cellRenderer: EmployeeCell,
    minWidth: 200,
    flex: 1.2,
    pinned: 'left',
    filter: 'agTextColumnFilter',
  },
  { field: 'email', headerName: 'Email', minWidth: 240, flex: 1.4, hide: true },
  {
    field: 'department',
    headerName: 'Department',
    cellRenderer: DepartmentCell,
    minWidth: 140,
    filter: 'agTextColumnFilter',
  },
  { field: 'position', headerName: 'Position', minWidth: 190, flex: 1 },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'rightAligned',
    filter: 'agNumberColumnFilter',
    valueFormatter: ({ value }) => formatUsd(value),
    minWidth: 120,
  },
  {
    field: 'hireDate',
    headerName: 'Hired',
    filter: 'agDateColumnFilter',
    filterParams: { comparator: dateComparator },
    valueFormatter: ({ value }) => formatDate(value),
    minWidth: 130,
  },
  { field: 'age', headerName: 'Age', type: 'rightAligned', filter: 'agNumberColumnFilter', width: 90 },
  { field: 'location', headerName: 'Location', minWidth: 130 },
  {
    field: 'performanceRating',
    headerName: 'Rating',
    cellRenderer: RatingCell,
    filter: 'agNumberColumnFilter',
    minWidth: 140,
  },
  {
    field: 'projectsCompleted',
    headerName: 'Projects',
    type: 'rightAligned',
    filter: 'agNumberColumnFilter',
    width: 110,
  },
  {
    field: 'skills',
    headerName: 'Skills',
    cellRenderer: SkillsCell,
    minWidth: 220,
    flex: 1,
    sortable: false,
    valueFormatter: ({ value }) => formatSkills(value),
    filterValueGetter: ({ data }) => formatSkills(data?.skills),
    getQuickFilterText: ({ value }) => formatSkills(value, ' '),
  },
  {
    field: 'manager',
    headerName: 'Manager',
    minWidth: 160,
    valueFormatter: ({ value }) => value ?? 'Top level',
  },
  {
    field: 'isActive',
    headerName: 'Status',
    cellRenderer: StatusCell,
    valueFormatter: ({ value }) => (value ? 'Active' : 'Inactive'),
    minWidth: 120,
    filter: 'agTextColumnFilter',
    filterValueGetter: ({ data }) => (data?.isActive ? 'Active' : 'Inactive'),
  },
]

export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: false,
  minWidth: 90,
}
