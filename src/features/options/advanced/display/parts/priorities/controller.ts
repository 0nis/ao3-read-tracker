import { getClass } from "./part";
import { createDisplayModeRow } from "./row";
import { toArray } from "./helpers";
import { DisplayModeRow } from "./types";

import { el } from "../../../../../../utils/ui/dom";
import { DisplayMode } from "../../../../../../enums/settings";
import { animateFLIP, measurePositions } from "./animation";

const rowMap = new Map<DisplayMode, DisplayModeRow>();

export function createDisplayModePrioritiesController(
  initialPriorities: Record<DisplayMode, number>,
) {
  let modes = toArray(initialPriorities);

  const listEl = el("div", { className: `${getClass()}__list` });

  function moveUp(index: number) {
    if (index === 0) return;
    [modes[index - 1], modes[index]] = [modes[index], modes[index - 1]];
    render();
  }

  function moveDown(index: number) {
    if (index === modes.length - 1) return;
    [modes[index + 1], modes[index]] = [modes[index], modes[index + 1]];
    render();
  }

  function render() {
    const prevRects = measurePositions(modes, (mode) => rowMap.get(mode)?.el);

    const fragment = document.createDocumentFragment();

    modes.forEach((mode, index) => {
      let row = rowMap.get(mode);

      if (!row) {
        row = createDisplayModeRow({
          mode,
          index,
          total: modes.length,
          onMoveUp: () => moveUp(modes.indexOf(mode)),
          onMoveDown: () => moveDown(modes.indexOf(mode)),
        });
        rowMap.set(mode, row);
      }

      row.setIndex(index);
      row.setDisabled(index === 0, index === modes.length - 1);

      fragment.appendChild(row.el);
    });

    listEl.replaceChildren(fragment);

    animateFLIP(modes, (mode) => rowMap.get(mode)?.el, prevRects);
  }

  function getValue() {
    return modes;
  }

  render();

  return {
    el: listEl,
    getValue,
    setValue(newModes: DisplayMode[]) {
      modes = [...newModes];
      render();
    },
  };
}
