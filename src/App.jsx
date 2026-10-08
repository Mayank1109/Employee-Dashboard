import { useCallback, useMemo, useRef, useState } from "react";
import EmployeeGrid, { EMPTY_STATS } from "./components/EmployeeGrid.jsx";
import KpiBand from "./components/KpiBand.jsx";
import DeptBar from "./components/DeptBar.jsx";
import ColumnsMenu from "./components/ColumnsMenu.jsx";
import DetailDrawer from "./components/DetailDrawer.jsx";
import { columnDefs } from "./components/columns.js";
import { formatInt } from "./utils/format.js";
import { useEmployeeData } from "./hooks/useEmployeeData.js";

const SIZES = [20, 1000, 10000, 50000];
const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Column ids and labels for the Columns menu (checkbox column excluded).
const COLUMN_LIST = columnDefs.map((c) => ({
  id: c.colId ?? c.field,
  name: c.headerName,
}));

export default function App() {
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");
  const [depts, setDepts] = useState([]);
  const [status, setStatus] = useState("all");
  const [density, setDensity] = useState("comfortable");
  const [stats, setStats] = useState(EMPTY_STATS);
  const [hidden, setHidden] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [openId, setOpenId] = useState(null);

  const apiRef = useRef(null);
  const resetRef = useRef(() => {});

  const { rows, rowsById, deptCounts, isLoading } = useEmployeeData(size);

  const openEmployee = openId != null ? (rowsById.get(openId) ?? null) : null;

  const handleReady = useCallback((api, reset) => {
    apiRef.current = api;
    resetRef.current = reset;
  }, []);

  const toggleDept = (d) =>
    setDepts((cur) =>
      cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
    );

  const toggleColumn = (id, visible) =>
    apiRef.current?.setColumnsVisible([id], visible);

  const exportCsv = () => {
    const api = apiRef.current;
    if (!api) return;
    api.exportDataAsCsv({
      fileName: "employees.csv",
      onlySelected: selectedCount > 0,
      allColumns: false,
    });
  };

  const resetView = () => {
    setSearch("");
    setDepts([]);
    setStatus("all");
    resetRef.current();
  };

  const closeDrawer = useCallback(() => setOpenId(null), []);
  const filtersActive = search || depts.length || status !== "all";

  return (
    <div className={`app ${openEmployee ? "app--drawer" : ""}`}>
      <header className="page-head">
        <div>
          <h1>People</h1>
          <p className="muted">
            {formatInt(rows.length)} employees across{" "}
            {Object.keys(deptCounts).length} departments
          </p>
        </div>
        <div className="size-picker" role="group" aria-label="Dataset size">
          <span className="size-picker__label">Rows in grid</span>
          {SIZES.map((n) => (
            <button
              key={n}
              className={`seg ${size === n ? "is-on" : ""}`}
              aria-pressed={size === n}
              onClick={() => {
                setSize(n);
                setOpenId(null);
                setSelectedCount(0);
              }}
            >
              {n === 20 ? "20 (sample)" : formatInt(n)}
            </button>
          ))}
        </div>
      </header>

      <KpiBand stats={stats} total={rows.length} />

      <DeptBar
        counts={deptCounts}
        selected={depts}
        onToggle={toggleDept}
        onClear={() => setDepts([])}
      />

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search name, skill, manager, location"
          aria-label="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="seg-group" role="group" aria-label="Filter by status">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`seg ${status === o.value ? "is-on" : ""}`}
              aria-pressed={status === o.value}
              onClick={() => setStatus(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="toolbar__spacer" />
        {selectedCount > 0 && (
          <span className="muted">{formatInt(selectedCount)} selected</span>
        )}
        <div className="seg-group" role="group" aria-label="Row density">
          {["comfortable", "compact"].map((d) => (
            <button
              key={d}
              className={`seg ${density === d ? "is-on" : ""}`}
              aria-pressed={density === d}
              onClick={() => setDensity(d)}
            >
              {d === "comfortable" ? "Comfortable" : "Compact"}
            </button>
          ))}
        </div>
        <ColumnsMenu
          columns={COLUMN_LIST}
          hidden={hidden}
          onToggle={toggleColumn}
        />
        <button className="btn" onClick={resetView} disabled={false}>
          {filtersActive ? "Reset view" : "Reset layout"}
        </button>
        <button className="btn btn--primary" onClick={exportCsv} disabled={isLoading}>
          {selectedCount > 0
            ? `Export ${formatInt(selectedCount)} selected`
            : "Export CSV"}
        </button>
      </div>

      <EmployeeGrid
        rows={rows}
        search={search}
        depts={depts}
        status={status}
        density={density}
        isLoading={isLoading}
        onReady={handleReady}
        onStats={setStats}
        onOpenRow={setOpenId}
        onSelectionCount={setSelectedCount}
        onHiddenChange={setHidden}
      />

      <DetailDrawer
        employee={openEmployee}
        rows={rows}
        onClose={closeDrawer}
        onOpen={setOpenId}
      />
    </div>
  );
}
