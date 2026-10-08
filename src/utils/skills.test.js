import assert from "node:assert/strict";
import test from "node:test";
import { formatSkills } from "./skills.js";

test("formats skills arrays for display and quick filtering", () => {
  const skills = ["JavaScript", "React", "Node.js"];

  assert.equal(formatSkills(skills), "JavaScript, React, Node.js");
  assert.equal(formatSkills(skills, " "), "JavaScript React Node.js");
});

test("keeps preformatted skill text unchanged", () => {
  assert.equal(formatSkills("JavaScript, React"), "JavaScript, React");
  assert.equal(formatSkills("JavaScript React", " "), "JavaScript React");
});

test("formats absent skills as empty text", () => {
  assert.equal(formatSkills(null), "");
  assert.equal(formatSkills(undefined), "");
});
