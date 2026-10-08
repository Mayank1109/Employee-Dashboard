import { useEffect, useState } from "react";
import rawData from "../data/employees.json";
import { generateEmployees } from "../data/generate.js";

const BASE = rawData.employees;

export function useEmployeeData(size) {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      const rows = generateEmployees(BASE, size);
      const rowsById = new Map(rows.map((row) => [row.id, row]));
      const deptCounts = {};
      for (const row of rows) {
        deptCounts[row.department] = (deptCounts[row.department] || 0) + 1;
      }

      if (!cancelled) {
        setDataset({ size, rows, rowsById, deptCounts });
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [size]);

  return {
    rows: dataset?.rows ?? [],
    rowsById: dataset?.rowsById ?? new Map(),
    deptCounts: dataset?.deptCounts ?? {},
    isLoading: dataset?.size !== size,
  };
}
