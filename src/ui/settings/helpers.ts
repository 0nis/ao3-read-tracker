export function populateSection<T extends { [key: string]: any }>(
  section: HTMLElement,
  settings: T
) {
  Object.entries(settings).forEach(([key, value]) => {
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
