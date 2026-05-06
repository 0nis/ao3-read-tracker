/**
 * Retrieves a value from an object using a dot-separated property path.
 *
 * Supports nested access such as `"modules.finished"` and returns
 * `undefined` if any part of the path does not exist.
 *
 * @param obj The source object to read from.
 * @param path Dot-separated property path.
 * @returns The value at the given path, or `undefined` if not found.
 */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current: any, key) => current?.[key], obj);
}

/**
 * Assigns a value to an object using a dot-separated property path.
 *
 * Missing intermediate objects are created automatically.
 * Existing non-object values along the path are replaced with objects.
 *
 * @param obj The target object to modify.
 * @param path Dot-separated property path.
 * @param value The value to assign at the given path.
 */
export function setByPath(
  obj: Record<string, any>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".");
  let current: Record<string, any> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (
      current[key] == null ||
      typeof current[key] !== "object" ||
      Array.isArray(current[key])
    )
      current[key] = {};

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}
