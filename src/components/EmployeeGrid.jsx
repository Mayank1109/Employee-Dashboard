import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { themeQuartz } from 'ag-grid-community'
import { columnDefs, defaultColDef } from './columns.js'

const STORAGE_KEY = 'employee-dashboard.columnState.v1'

const rowSelection = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: false,
}

const getRowId = (p) => String(p.data.id)

export const EMPTY_STATS = { count: 0, active: 0, salary: 0, rating: 0, projects: 0 }

export default function EmployeeGrid({
  rows,
  search,
  depts,
  status,
  density,
  isLoading,
  onReady,
  onStats,
  onOpenRow,
  onSelectionCount,
  onHiddenChange,
}) {
  const apiRef = useRef(null)
  const saveTimer = useRef(null)

  // The external filter reads from a ref so AG Grid always sees current values
  // without us having to recreate the callbacks.
  const external = useRef({ depts, status })
  external.current = { depts, status }

  const isExternalFilterPresent = useCallback(
    () => external.current.depts.length > 0 || external.current.status !== 'all',
    []
  )
  const doesExternalFilterPass = useCallback((node) => {
    const { depts: d, status: s } = external.current
    if (d.length && !d.includes(node.data.department)) return false
    if (s === 'active' && !node.data.isActive) return false
    if (s === 'inactive' && node.data.isActive) return false
    return true
  }, [])

  useEffect(() => {
    apiRef.current?.onFilterChanged()
  }, [depts, status])

  const theme = useMemo(
    () =>
      themeQuartz.withParams({
        fontFamily: 'Figtree, system-ui, sans-serif',
        fontSize: 14,
        accentColor: '#3A5A9B',
        foregroundColor: '#1B2333',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E5EB',
        headerBackgroundColor: '#F5F6F8',
        headerTextColor: '#4A5468',
        headerFontWeight: 600,
        rowHoverColor: '#F5F8FD',
        selectedRowBackgroundColor: '#EAF0FA',
        wrapperBorderRadius: 8,
        spacing: density === 'compact' ? 5 : 8,
      }),
    [density]
  )

  const syncStats = useCallback(
    (api) => {
      const s = { ...EMPTY_STATS }
      api.forEachNodeAfterFilter((n) => {
        const d = n.data
        s.count++
        if (d.isActive) s.active++
        s.salary += d.salary
        s.rating += d.performanceRating
        s.projects += d.projectsCompleted
      })
      onStats(s)
    },
    [onStats]
  )

  const syncHidden = useCallback(
    (api) => {
      onHiddenChange(api.getColumnState().filter((c) => c.hide).map((c) => c.colId))
    },
    [onHiddenChange]
  )

  const persistLayout = useCallback(
    (e) => {
      syncHidden(e.api)
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(e.api.getColumnState()))
        } catch {
          /* storage unavailable: layout just won't persist */
        }
      }, 300)
    },
    [syncHidden]
  )

  const handleReady = useCallback(
    (e) => {
      apiRef.current = e.api
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (saved) e.api.applyColumnState({ state: saved, applyOrder: true })
      } catch {
        /* ignore corrupt saved state */
      }
      syncHidden(e.api)
      onReady(e.api, () => {
        try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
        e.api.resetColumnState()
        e.api.setFilterModel(null)
        e.api.deselectAll()
        syncHidden(e.api)
      })
    },
    [onReady, syncHidden]
  )

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  const handleRowClicked = useCallback(
    (e) => {
      if (e.event?.target?.closest?.('.ag-selection-checkbox, .ag-checkbox')) return
      onOpenRow(e.data.id)
    },
    [onOpenRow]
  )

  const handleCellKeyDown = useCallback(
    (e) => {
      if (e.event?.key === 'Enter' && !e.editing) onOpenRow(e.data.id)
    },
    [onOpenRow]
  )

  return (
    <div className="grid-wrap" aria-busy={isLoading}>
      <AgGridReact
        theme={theme}
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowSelection={rowSelection}
        quickFilterText={search}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        animateRows={rows.length <= 1000}
        rowBuffer={10}
        suppressCellFocus={false}
        overlayNoRowsTemplate="<span class='no-rows'>No employees match these filters. Clear a filter to see more.</span>"
        onGridReady={handleReady}
        onModelUpdated={(e) => syncStats(e.api)}
        onSelectionChanged={(e) => onSelectionCount(e.api.getSelectedRows().length)}
        onRowClicked={handleRowClicked}
        onCellKeyDown={handleCellKeyDown}
        onColumnMoved={persistLayout}
        onColumnResized={(e) => e.finished && persistLayout(e)}
        onColumnVisible={persistLayout}
        onColumnPinned={persistLayout}
        onSortChanged={persistLayout}
      />
      {isLoading && (
        <div className="grid-skeleton" role="status" aria-label="Loading employees">
          <span className="sr-only">Loading employees</span>
          <div className="grid-skeleton__header" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <span className="grid-skeleton__bar" key={index} />
            ))}
          </div>
          {Array.from({ length: 8 }, (_, rowIndex) => (
            <div className="grid-skeleton__row" aria-hidden="true" key={rowIndex}>
              {Array.from({ length: 8 }, (_, cellIndex) => (
                <span
                  className={`grid-skeleton__cell grid-skeleton__cell--${cellIndex}`}
                  key={cellIndex}
                >
                  {cellIndex === 0 && <span className="grid-skeleton__avatar" />}
                  <span className="grid-skeleton__bar" />
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
