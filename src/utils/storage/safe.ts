import { WorksData } from "../../data/models/works";
import { SettingsData } from "../../data/models/settings";
import { SymbolsData } from "../../data/models/symbols";

import { StorageResult } from "../../types/results";

import { error } from "../extension";

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
  } catch (err) {
    error(`Error in ${context}:`, err);
    return { success: false, error: err, data: undefined };
  }
}

/**
 * Produces a "safe" version of a data service by wrapping all async methods.
 *
 * For each property in `D`:
 *  - If it is an async method (`(...args) => Promise<R>`),
 *    it becomes `(...args) => Promise<StorageResult<R>>`.
 *  - Otherwise, the property is left unchanged.
 */
export type SafeServiceFor<D> = {
  [K in keyof D]: D[K] extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Promise<StorageResult<R>>
    : D[K];
};

/**
 * Wraps all async methods of a data service with error handling.
 * Each method will return a StorageResult instead of throwing errors.
 *
 * @param name The name of the service (used for error logging context)
 * @param data The data instance to wrap
 * @returns A wrapped service where all methods return StorageResult
 */
export function createSafeService<D>(name: string, data: D): SafeServiceFor<D> {
  const wrapped = {} as any;

  for (const key of Object.getOwnPropertyNames(
    Object.getPrototypeOf(data)
  ) as Array<keyof D>) {
    const value = (data as any)[key];
    if (typeof value === "function" && key !== "constructor") {
      (wrapped as any)[key] = (...args: unknown[]) =>
        safeExecute(
          () => (value as any).apply(data, args),
          `${name}.${String(key)}`
        );
    }
  }

  return wrapped;
}
