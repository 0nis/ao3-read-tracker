export async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`OAuth server returned non-JSON response: ${text}`);
  }
}

export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`OAuth response is missing "${fieldName}".`);

  return value;
}

export function requireNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value))
    throw new Error(`OAuth response is missing "${fieldName}".`);

  return value;
}
