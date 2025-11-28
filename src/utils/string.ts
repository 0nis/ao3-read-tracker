export function toLowerCaseAndReplaceSpaces(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
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
