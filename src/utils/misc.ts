export function toLowerCaseAndReplaceSpaces(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function camelCaseToSentenceCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export function snakeCaseToSentenceCase(str: string): string {
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Helper to extract string or number keys from a JSON-like string buffer */
export const extractKey = (
  buffer: string,
  key: string,
  type: "string" | "number"
) => {
  const regex =
    type === "string"
      ? new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`)
      : new RegExp(`"${key}"\\s*:\\s*(\\d+)`);
  const match = buffer.match(regex);
  if (match) return type === "string" ? match[1] : Number(match[1]);
};

/** Checks if a value is empty (array or object) */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object")
    return Object.keys(value).length === 0;
  return false;
}

export function replacePlaceholders(
  text: string,
  replacements: Record<string, string>
) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`%${key}%`, "g");
    return acc.replace(pattern, value);
  }, text);
}
