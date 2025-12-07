import { ABBREVIATION } from "../../../constants/global";
import { CustomInputType } from "../../../enums/ui";
import { FormField, FormGroup, FormItem } from "../../../types/forms";
import { getLocalDateTimeString } from "../../date";
import { walkFormItems } from "./items";

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

function getInputValue(input: HTMLElement): any {
  switch (input.constructor) {
    case HTMLInputElement:
      const el = input as HTMLInputElement;
      switch (el.type) {
        case "checkbox":
          return el.checked;
        case "number":
          return parseInt(el.value, 10);
        case "datetime-local":
          return new Date(el.value).getTime();
        default:
          return el.value;
      }
    case HTMLTextAreaElement:
      return (input as HTMLTextAreaElement).value.trim();
    case HTMLSelectElement:
      return (input as HTMLSelectElement).value;
    case HTMLDivElement:
      const type = input.getAttribute("input-type");
      if (type === CustomInputType.TOGGLE_SWITCH) {
        const toggleInput = input.querySelector(
          "input[type='checkbox']"
        ) as HTMLInputElement;
        return toggleInput?.checked ?? undefined;
      }
      return undefined;
    default:
      return undefined;
  }
}

function setInputValue(input: HTMLElement, value: unknown): void {
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
    case HTMLDivElement: {
      const type = input.getAttribute("input-type");
      if (type === CustomInputType.TOGGLE_SWITCH) {
        const toggleInput = input.querySelector(
          "input[type='checkbox']"
        ) as HTMLInputElement;
        if (toggleInput) toggleInput.checked = Boolean(value);
      }
      break;
    }
  }
}
