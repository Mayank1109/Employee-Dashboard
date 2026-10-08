export function formatSkills(value, separator = ", ") {
  if (Array.isArray(value)) return value.join(separator);
  return value == null ? "" : String(value);
}
