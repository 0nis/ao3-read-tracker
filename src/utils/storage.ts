import { BaseData } from "../data/base";
import { SettingsData } from "../data/settings";
import { StorageResult } from "../types/storage";

/**
 * Safely execute a function and handle errors.
 * @param fn The function to execute.
 * @param context The context in which the function is executed.
 * @returns The result of the function or null if an error occurred.
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: string
): Promise<StorageResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    console.error(`[AO3 Mark as Read] Error in ${context}:`, error);
    return { success: false, error, data: undefined };
  }
}

/**
 * Automatically wraps every async method in BaseData<T> with safeExecute().
 * @param name The name of the service, used for error context.
 * @param data The BaseData<T> instance to wrap.
 * @returns An object with the same methods as BaseData<T>, but wrapped in safeExecute().
 */
export function createSafeService<
  T extends { id: string },
  D extends BaseData<T> | SettingsData<T>
>(
  name: string,
  data: D
): {
  [K in keyof D]: D[K] extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Promise<StorageResult<R>>
    : D[K];
} {
  const wrapped: any = {};

  for (const key of Object.getOwnPropertyNames(
    Object.getPrototypeOf(data)
  ) as (keyof D)[]) {
    const value = data[key];
    if (typeof value === "function" && key !== "constructor") {
      wrapped[key] = (...args: unknown[]) =>
        safeExecute(
          () => (value as any).apply(data, args),
          `${name}.${String(key)}`
        );
    }
  }

  return wrapped;
}

/**
 * Reads the content of a File object as text.
 * @param file The File object to read.
 * @returns A promise that resolves with the file content as a string.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
