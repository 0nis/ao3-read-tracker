/**
 * Reads a JSON response from the OAuth server.
 * Throws an error if the response is not valid JSON.
 *
 * @param response The response from the OAuth server
 * @returns The parsed JSON
 */
export async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`OAuth server returned non-JSON response: ${text}`);
  }
}

/**
 * Throws an error containing the field name if the value is not a string or is empty.
 *
 * @param value Any value to check
 * @param fieldName Name of the field for context in the error message
 * @returns The value as type string
 */
export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`OAuth response is missing "${fieldName}".`);

  return value;
}

/**
 * Throws an error containing the field name if the value is not a number or is NaN.
 *
 * @param value Any value to check
 * @param fieldName Name of the field for context in the error message
 * @returns The number as type number
 */
export function requireNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value))
    throw new Error(`OAuth response is missing "${fieldName}".`);

  return value;
}
