import { getClass } from "./setup";
import { WorkMetaDetailsListItem } from "./types";

export function getItemsFromRules(
  rules: { key: string; label: string; getValue: () => string }[]
): Record<string, WorkMetaDetailsListItem> {
  return rules.reduce((acc, rule) => {
    acc[rule.key] = {
      label: rule.label,
      value: rule.getValue(),
    };
    return acc;
  }, {} as Record<string, WorkMetaDetailsListItem>);
}

export function removeExtensionMetaFromArea(area: HTMLElement): void {
  const extensionMeta = area.querySelectorAll(`.${getClass()}`);
  extensionMeta.forEach((meta) => meta.remove());
}
