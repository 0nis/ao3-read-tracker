import { CLASS_PREFIX } from "../../../constants/classes";
import { el } from "../dom";

/**
 * Builds a select element from an enum or enum-like object.
 *
 * @param enumObj An enum or object with string values
 * @param selected The value to mark as selected (optional)
 * @param attrs Additional HTML attributes to set on the select element (optional)
 * @returns A populated HTMLSelectElement
 */
export function buildSelectFromEnum<T extends Record<string, string>>(
  enumObj: T,
  selected?: T[keyof T],
  attrs?: Record<string, string>
): HTMLSelectElement {
  const select = el("select", {
    className: `${CLASS_PREFIX}__select`,
    attrs,
  }) as HTMLSelectElement;
  Object.values(enumObj).forEach((v) => {
    const option = el("option", {
      value: String(v),
      textContent: String(v).replace(/_/g, " "),
    });
    if (selected && selected === v) option.selected = true;
    select.appendChild(option);
  });
  return select;
}
