import { localMemory } from "../../../../services/memory";
import { EqualityFilter } from "../../../../types/storage";
import { FilterState } from "../types";

/**
 * Gets a stored value from local memory and returns it, or a fallback value.
 * Used to persist user options.
 * @param key The key of the value to get
 * @param fallback The fallback value to return if the stored value is null
 * @param validator An optional function to validate the stored value
 * @returns The stored value
 */
export function getStored<T>({
  key,
  fallback,
  validator,
}: {
  key: string;
  fallback: T;
  validator?: (val: unknown) => val is T;
}): T {
  const stored = localMemory.get(key);
  if (validator) if (stored !== null && validator?.(stored)) return stored;
  if (stored !== null) return stored as T;
  return fallback;
}

/**
 * Gets a {@link EqualityFilter} array from a {@link FilterState} object.
 */
export function filtersFromState<T>(
  state: FilterState<T>
): EqualityFilter<T>[] {
  return Object.entries(state).map(([field, value]) => ({
    field: field as keyof T,
    value,
  })) as EqualityFilter<T>[];
}
