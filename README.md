# Employee Dashboard (AG Grid + React)

A client-side employee dashboard built with React, Vite and AG Grid Community.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm test         # employee data generator tests
```

## What it does

- **AG Grid table** of the 20-row sample dataset (`src/data/employees.json`) with sorting, per-column filters (text, number, date), resizing, reordering, pinning, row selection and pagination.
- **Summary band** (headcount, active share, average salary, average rating, projects) that recalculates from whatever rows are currently filtered.
- **Headcount bar** that doubles as a multi-select department filter.
- **Quick search** across name, email, skills, manager and location, plus an Active / Inactive status filter.
- **Column menu**, **density toggle**, and **saved layout** (column order, width, visibility, pinning and sort persist in `localStorage`; "Reset layout" clears it).
- **CSV export** of the current filtered and sorted view, or only the selected rows.
- **Detail drawer** on row click or Enter, with reporting line navigation.

## Scaling

Use the "Rows in grid" switch to load 1,000 / 10,000 / 50,000 generated rows (`src/data/generate.js`, deterministic, derived from the sample). Animated skeleton rows appear while a dataset is being prepared. AG Grid's row virtualisation keeps the DOM small, pagination limits the visible page, and animations switch off above 1,000 rows. The external department and status filters read from a ref so the grid callbacks stay stable and rows are never re-created on filter changes.

## Structure

```
src/
  App.jsx                 state, toolbar, layout
  data/                   sample JSON, row preparation, large-data generator
    generate.test.js      generator output and determinism tests
  hooks/
    useEmployeeData.js    generated rows and department lookup data
  components/
    EmployeeGrid.jsx      AG Grid setup, theme, filters, layout persistence
    columns.js            column definitions
    renderers.jsx         cell renderers
    KpiBand.jsx, DeptBar.jsx, ColumnsMenu.jsx, DetailDrawer.jsx
  utils/format.js         currency, date, tenure helpers, department colours
```
