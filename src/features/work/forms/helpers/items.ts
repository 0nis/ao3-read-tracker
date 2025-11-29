import { WorkFormField, WorkFormFieldType, WorkFormItem } from "../types";

export function getItemFromWorkFormItemArray<T>(
  datafield: keyof T,
  items: WorkFormItem<T>[]
): WorkFormField<T> | undefined {
  return items
    .filter((i) => i.type === WorkFormFieldType.GROUP)
    .flatMap((g) => (g as any).fields)
    .find((f) => f.dataField === datafield);
}

export function walkItems<T>(
  items: WorkFormItem<T>[],
  fn: (field: WorkFormField<T>) => void
) {
  for (const item of items) {
    if (item.type === WorkFormFieldType.FIELD) {
      fn(item);
    } else {
      walkItems(item.fields, fn);
    }
  }
}
