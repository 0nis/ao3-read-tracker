import { CLASS_PREFIX } from "../constants/classes";
import { MessageType } from "../constants/enums";
import { el } from "./dom";

/**
 * Shows a message within a container element, replacing any existing message.
 *
 * @param container The container element where the message will be displayed
 * @param type The type of message (info, success, warning, error, loading)
 * @param message The text to display
 * @param className Optional custom class name for the message element
 */
export function showFormMessage(
  container: HTMLElement,
  type: MessageType,
  message: string,
  className: string = `${CLASS_PREFIX}__msg`
): void {
  const oldMsg = container.querySelector(`.${className}`);
  if (oldMsg) oldMsg.remove();

  const msg = el("div", {
    className: `${className} ${className}--${type}`,
    textContent: message,
    attrs: { role: `${type === MessageType.ERROR ? "alert" : "status"}` },
  });

  container.appendChild(msg);
}

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
  const select = el("select", { attrs }) as HTMLSelectElement;
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

/**
 * Populates form inputs in a section with data using data-field attributes.
 * Each input must have a data-field attribute matching a key in the data object.
 * Supports text inputs, checkboxes, and select elements.
 *
 * @param section The section containing inputs to populate
 * @param data The data object with values to populate
 */
export function populateSection<T extends { [key: string]: any }>(
  section: HTMLElement,
  data: T
) {
  Object.entries(data).forEach(([key, value]) => {
    const input = section.querySelector(`[data-field="${key}"]`) as
      | HTMLInputElement
      | HTMLSelectElement
      | null;
    if (!input) return;

    if (input instanceof HTMLInputElement) {
      if (input.type === "checkbox") input.checked = Boolean(value);
      else input.value = value as string;
    } else if (input instanceof HTMLSelectElement) {
      input.value = value as string;
    }
  });
}

/**
 * Extracts values from form inputs in a section using data-field attributes.
 * Each input must have a data-field attribute to be included in the result.
 * Supports text inputs, checkboxes, and select elements.
 *
 * @param section The section containing inputs to extract from
 * @returns An object with extracted key-value pairs
 */
export function extractSectionValues<T>(section: HTMLElement): Partial<T> {
  const result: Partial<T> = {};
  const inputs = section.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    "[data-field]"
  );
  inputs.forEach((input) => {
    const key = input.dataset.field as keyof T;
    if (input instanceof HTMLInputElement) {
      result[key] =
        input.type === "checkbox"
          ? (input.checked as any)
          : (input.value as any);
    } else if (input instanceof HTMLSelectElement) {
      result[key] = input.value as any;
    }
  });
  return result;
}
