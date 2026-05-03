import { createReorderableListController } from "./controller";
import { getStyles } from "./style";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { injectStyles } from "../../../../utils/dom";

export type ReorderableListOptions = {
  items?: Record<string, number>;
  renderLabel?: (item: string) => string;
  id?: string;
  attrs?: Record<string, string>;
};

export const getClass = () => `${CLASS_PREFIX}__reorderable-list`;

export function reorderableList({
  items = {},
  renderLabel = (item) => String(item),
  id,
  attrs,
}: ReorderableListOptions = {}): HTMLElement {
  injectStyles(
    `${CLASS_PREFIX}__styles--reorderable-list`,
    getStyles(getClass()),
  );

  const controller = createReorderableListController(items, renderLabel);

  if (id) controller.el.id = id;

  (controller.el as any).__controller = controller;
  controller.el.dataset.inputType = "reorderable-list";

  if (attrs)
    Object.entries(attrs).forEach(([k, v]) => controller.el.setAttribute(k, v));

  return controller.el;
}
