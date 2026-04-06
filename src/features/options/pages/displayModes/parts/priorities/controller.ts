import { getClass } from "./part";
import { createDisplayModeRow } from "./row";
import { toArray } from "./helpers";
import { animateFLIP, measurePositions } from "./animation";
import { DisplayModeRow } from "./types";

import { el } from "../../../../../../utils/ui/dom";
import { reportSrLive } from "../../../../../../utils/ui/accessibility";
import { toTitleCase } from "../../../../../../utils/string";
import { DisplayMode } from "../../../../../../enums/settings";

const rowMap = new Map<DisplayMode, DisplayModeRow>();

export async function createDisplayModePrioritiesController(
  initialPriorities: Record<DisplayMode, number>,
) {
  let modes = toArray(initialPriorities);

  const listEl = el("ol", { className: `${getClass()}__list` });

  async function move(
    index: number,
    direction: -1 | 1,
    label: string = modes[index],
  ) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= modes.length) return;

    [modes[newIndex], modes[index]] = [modes[index], modes[newIndex]];

    await render();
    reportSrLive(
      `${label} moved ${direction === -1 ? "up" : "down"} to position ${newIndex + 1}`,
    );
  }

  async function render() {
    const prevRects = measurePositions(modes, (mode) => rowMap.get(mode)?.el);

    const fragment = document.createDocumentFragment();

    for (const [index, mode] of modes.entries()) {
      const label = toTitleCase(mode);
      let row = rowMap.get(mode);

      if (!row) {
        row = await createDisplayModeRow({
          mode,
          label,
          index,
          total: modes.length,
          onMoveUp: async () => await move(modes.indexOf(mode), -1, label),
          onMoveDown: async () => await move(modes.indexOf(mode), 1, label),
        });
        rowMap.set(mode, row);
      }

      row.setIndex(index);
      row.setDisabled(index === 0, index === modes.length - 1);
      row.setAria(label, index, modes.length);

      fragment.appendChild(row.el);
    }

    listEl.replaceChildren(fragment);

    animateFLIP(modes, (mode) => rowMap.get(mode)?.el, prevRects);
  }

  function getValue() {
    return modes;
  }

  await render();

  return {
    el: listEl,
    getValue,
    async setValue(newModes: DisplayMode[]) {
      modes = [...newModes];
      await render();
    },
  };
}
