/** Checks if a value is empty (array or object) */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object")
    return Object.keys(value).length === 0;
  return false;
}
