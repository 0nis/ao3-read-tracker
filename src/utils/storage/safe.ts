import { WorksData } from "../../data/models/works";
import { SettingsData } from "../../data/models/settings";
import { SymbolsData } from "../../data/models/symbols";

import { StorageResult } from "../../types/results";

import { createExtensionMsg } from "../extension/console";

/**
 * Safely executes an async function and wraps the result in a StorageResult.
 * Catches any errors and logs them with context.
 *
 * @param fn The async function to execute
 * @param context A description of where this function is called (for error logging)
 * @returns A StorageResult with either the data or error information
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: string
): Promise<StorageResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    console.error(createExtensionMsg(`Error in ${context}:`), error);
    return { success: false, error, data: undefined };
  }
}

/**
 * Wraps all async methods of a data service with error handling.
 * Each method will return a StorageResult instead of throwing errors.
 *
 * @param name The name of the service (used for error logging context)
 * @param data The data instance to wrap
 * @returns A wrapped service where all methods return StorageResult
 */
export function createSafeService<
  T extends { id: string },
  D extends WorksData<T> | SettingsData<T> | SymbolsData<T>
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
 * @deprecated Switching to a different import/export method
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
