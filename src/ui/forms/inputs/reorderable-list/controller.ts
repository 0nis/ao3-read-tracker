import { getClass } from "./element";
import { createReorderableRow } from "./row";
import { toArray, toPriorities } from "./helpers";
import { animateFLIP, measurePositions } from "./animation";
import { ReorderableRow } from "./types";
import { el } from "../../../../utils/dom";

export function createReorderableListController(
  initialItems: Record<string, number>,
  renderLabel: (item: string) => string,
) {
  let items = toArray(initialItems);

  const listEl = el("ol", { className: `${getClass()}` });

  const rowMap = new Map<string, ReorderableRow>();

  async function move(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    [items[newIndex], items[index]] = [items[index], items[newIndex]];

    render();
  }

  async function render() {
    const prevRects = measurePositions(items, (item) => rowMap.get(item)?.el);

    const fragment = document.createDocumentFragment();

    for (const [index, item] of items.entries()) {
      const label = renderLabel(item);

      let row = rowMap.get(item);

      if (!row) {
        row = createReorderableRow({
          item,
          label,
          index,
          total: items.length,
          onMoveUp: () => move(items.indexOf(item), -1),
          onMoveDown: () => move(items.indexOf(item), 1),
        });

        rowMap.set(item, row);
      }

      row.setIndex(index);
      row.setDisabled(index === 0, index === items.length - 1);
      row.setAria(label, index, items.length);

      fragment.appendChild(row.el);
    }

    listEl.replaceChildren(fragment);

    animateFLIP(items, (item) => rowMap.get(item)?.el, prevRects);
  }

  function getValue(): Record<string, number> {
    return toPriorities(items);
  }

  async function setValue(newItems: Record<string, number>) {
    items = toArray(newItems);
    render();
  }

  render();

  return {
    el: listEl,
    getValue,
    setValue,
  };
}
