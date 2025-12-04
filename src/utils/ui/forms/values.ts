/**
 * Populates form inputs in a section with data using data-field attributes.
 * Each input must have a data-field attribute matching a key in the data object.
 * Supports text inputs, checkboxes, and select elements.
 *
 * @param form The form element containing inputs to populate
 * @param data The data object with values to populate
 */
export function populateForm<T extends { [key: string]: any }>(
  form: HTMLElement,
  data: T
) {
  Object.entries(data).forEach(([key, value]) => {
    const input = form.querySelector(`[data-field="${key}"]`) as
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
 * @param form The form element containing inputs to extract from
 * @returns An object with extracted key-value pairs
 */
export function extractFormValues<T>(form: HTMLElement): Partial<T> {
  const result: Partial<T> = {};
  const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
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
