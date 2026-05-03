import { select } from "./select";

/**
 * Builds a select element from an enum or enum-like object using {@link select}
 *
 * @param enumObj An enum or object with string values
 * @param selected The value to mark as selected (optional)
 * @param attrs Additional HTML attributes to set on the select element (optional)
 * @returns A populated HTMLSelectElement
 */
export function enumSelect<T extends Record<string, string>>(
  enumObj: T,
  selected?: T[keyof T],
  attrs?: Record<string, string>
): HTMLSelectElement {
  return select({
    options: Object.values(enumObj) as string[],
    defaultOption: selected,
    attrs,
  });
}
