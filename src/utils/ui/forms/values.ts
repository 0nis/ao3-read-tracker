import { walkFormItems } from "./items";
import { getLocalDateTimeString } from "../../date";
import { FormField, FormGroup, FormItem } from "../../../types/forms";

/**
 * Extracts values from form inputs in a section using data-field attributes.
 * Each input must have a data-field attribute to be included in the result.
 *
 * @template T The data type represented by the form
 * @template FIELD A form field type that extends {@link FormField<T>}
 * @template GROUP A form group type that extends {@link FormGroup<T, FIELD, GROUP>}
 *
 * @param items Array of a form field type that extends {@link FormItem<T, FIELD, GROUP>}
 * @returns Partial object with extracted key-value pairs
 */
export function extractFormValues<
  T,
  FIELD extends FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP>
>(items: Array<FormItem<T, FIELD, GROUP>>): Partial<T> {
  const result: Partial<T> = {};
  walkFormItems<T, FIELD, GROUP>(items, (field) => {
    result[field.dataField!] = getInputValue(field.input!);
  });
  return result;
}

/**
 * Populates form inputs in a form with data using data-field attributes.
 * Each input must have a data-field attribute matching a key in the data object.
 *
 * @template T The data type represented by the form
 * @template FIELD A form field type that extends {@link FormField<T>}
 * @template GROUP A form group type that extends {@link FormGroup<T, FIELD, GROUP>}
 *
 * @param items Array of a form field type that extends {@link FormItem<T, FIELD, GROUP>}
 * @param data Partial data object to populate the form with
 */
export function populateFormValues<
  T,
  FIELD extends FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP>
>(items: Array<FormItem<T, FIELD, GROUP>>, data: Partial<T>) {
  walkFormItems<T, FIELD, GROUP>(items, (field) => {
    const value = data[field.dataField!];
    setInputValue(field.input!, value);
  });
}

/**
 * If the element is an input, textarea, or select, returns it.
 * Otherwise, returns the first input, textarea, or select inside the element.
 */
export function getInputElement(
  element: HTMLElement
): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return element;
  }

  return element.querySelector<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >("input, textarea, select");
}

export function getInputValue(element: HTMLElement): any {
  const input = getInputElement(element);
  if (!input) return undefined;
  switch (input.constructor) {
    case HTMLInputElement:
      const el = input as HTMLInputElement;
      switch (el.type) {
        case "checkbox":
          return el.checked;
        case "number":
          return Number.isNaN(el.valueAsNumber) ? undefined : el.valueAsNumber;
        case "datetime-local":
          return new Date(el.value).getTime();
        case "file":
          return el.files?.[0];
        default:
          return el.value;
      }
    case HTMLTextAreaElement:
      return (input as HTMLTextAreaElement).value.trim();
    case HTMLSelectElement:
      return (input as HTMLSelectElement).value;
    default:
      return undefined;
  }
}

export function setInputValue(element: HTMLElement, value: unknown): void {
  const input = getInputElement(element);
  if (!input) return;
  switch (input.constructor) {
    case HTMLInputElement: {
      const el = input as HTMLInputElement;
      switch (el.type) {
        case "checkbox":
          el.checked = Boolean(value);
          break;
        case "number":
          el.value = value != null ? String(value) : el.defaultValue || "";
          break;
        case "datetime-local":
          el.value = value
            ? getLocalDateTimeString(new Date(value as number))
            : el.defaultValue || "";
          break;
        case "file":
          break;
        default:
          el.value = value != null ? String(value) : "";
      }
      break;
    }
    case HTMLTextAreaElement: {
      const el = input as HTMLTextAreaElement;
      el.value = value != null ? String(value) : "";
      break;
    }
    case HTMLSelectElement: {
      const el = input as HTMLSelectElement;
      el.value =
        value != null ? String(value) : el.getAttribute("default-value") || "";
      break;
    }
  }
}
