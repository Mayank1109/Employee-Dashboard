import assert from "node:assert/strict";
import test from "node:test";
import rawData from "./employees.json" with { type: "json" };
import { generateEmployees } from "./generate.js";

const base = rawData.employees;

test("returns the requested sample rows with prepared fields", () => {
  const rows = generateEmployees(base, 3);

  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((row) => row.id), [1, 2, 3]);
  assert.equal(rows[0].fullName, `${base[0].firstName} ${base[0].lastName}`);
  assert.ok(rows[0].hireDate instanceof Date);
});

test("generates the requested number of rows with unique sequential ids", () => {
  const count = base.length + 25;
  const rows = generateEmployees(base, count);

  assert.equal(rows.length, count);
  assert.deepEqual(
    rows.map((row) => row.id),
    Array.from({ length: count }, (_, index) => index + 1),
  );
});

test("generated data is deterministic and leaves the sample unchanged", () => {
  const original = structuredClone(base);
  const first = generateEmployees(base, base.length + 5);
  const second = generateEmployees(base, base.length + 5);

  assert.deepEqual(first, second);
  assert.deepEqual(base, original);
});
