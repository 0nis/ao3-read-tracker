import { FormItemType } from "../../enums/forms";
import { FormField, FormGroup, FormItem } from "../../types/forms";

/**
 * Walks through form items recursively and applies a callback to each form field.
 *
 * @template T The data type represented by the form
 * @template FIELD A form field type that extends {@link FormField<T>}
 * @template GROUP A form group type that extends {@link FormGroup<T, FIELD, GROUP>}
 *
 * @param items Array of a form field type that extends {@link FormItem<T, FIELD, GROUP>}
 * @param fn Callback function to apply to each form field
 */
export function walkFormItems<
  T,
  FIELD extends FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP>,
>(items: Array<FormItem<T, FIELD, GROUP>>, fn: (field: FIELD) => void) {
  for (const item of items) {
    if (item.type === "field") fn(item as FIELD);
    else walkFormItems<T, FIELD, GROUP>((item as GROUP).fields, fn);
  }
}

/**
 * Finds a form field by its data field identifier.
 * Needed because of nested groups.
 *
 * @template T The data type represented by the form
 * @template FIELD A form field type that extends {@link FormField<T>}
 * @template GROUP A form group type that extends {@link FormGroup<T, FIELD, GROUP>}
 *
 * @param datafield The data field identifier to search for
 * @param items Array of a form field type that extends {@link FormItem<T, FIELD, GROUP>}
 * @returns The form field matching the data field identifier, or undefined if not found
 */
export function getFormItemByDataField<
  T,
  FIELD extends FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP>,
>(
  datafield: keyof T,
  items: Array<FormItem<T, FIELD, GROUP>>,
): FIELD | undefined {
  return items
    .filter((i) => i.type === FormItemType.GROUP)
    .flatMap((g) => (g as any).fields)
    .find((f) => f.dataField === datafield);
}
