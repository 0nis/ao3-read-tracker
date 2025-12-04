import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el, injectStyles } from "../../../dom";
import { getStyles } from "./style";

const className = `${CLASS_PREFIX}__enum-select`;

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
  injectStyles(`${className}--styles`, getStyles(className));
  const select = el("select", {
    className: className,
    attrs: {
      ...attrs,
      "default-value": selected ? String(selected) : "",
    },
  }) as HTMLSelectElement;
  Object.values(enumObj).forEach((v) => {
    const option = el("option", {
      value: String(v),
      textContent: String(v)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    });
    if (selected && selected === v) option.selected = true;
    select.appendChild(option);
  });
  return select;
}
