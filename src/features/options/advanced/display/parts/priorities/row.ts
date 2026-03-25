import { getClass } from "./part";
import { DisplayModeRow, DisplayModeRowOptions } from "./types";

import { el } from "../../../../../../utils/ui/dom";

export function createDisplayModeRow({
  label,
  index,
  total,
  onMoveUp,
  onMoveDown,
}: DisplayModeRowOptions): DisplayModeRow {
  const upBtn = buildMoveBtn(
    "up",
    onMoveUp,
    index === 0,
    label,
    getUpTarget(index),
  );
  const downBtn = buildMoveBtn(
    "down",
    onMoveDown,
    index === total - 1,
    label,
    getDownTarget(index),
  );

  const indexEl = buildRowIndex(index);

  const elRef = el("li", { className: `${getClass()}__row` }, [
    el("div", { className: `${getClass()}__row-content` }, [
      indexEl,
      buildRowLabel(label),
    ]),
    el("div", { className: `${getClass()}__row-controls` }, [upBtn, downBtn]),
  ]);

  return {
    el: elRef,
    setIndex(newIndex: number) {
      indexEl.textContent = String(newIndex + 1);
    },
    setDisabled(isFirst: boolean, isLast: boolean) {
      upBtn.disabled = isFirst;
      downBtn.disabled = isLast;
    },
    setAria(label: string, index: number) {
      upBtn.setAttribute(
        "aria-label",
        `Move ${label} up to position ${getUpTarget(index) + 1}`,
      );
      downBtn.setAttribute(
        "aria-label",
        `Move ${label} down to position ${getDownTarget(index) + 1}`,
      );
    },
  };
}

function buildRowIndex(index: number): HTMLElement {
  return el(
    "span",
    { className: `${getClass()}__row-index` },
    String(index + 1),
  );
}

function buildRowLabel(label: string): HTMLElement {
  return el("span", { className: `${getClass()}__row-label` }, label);
}

function buildMoveBtn(
  type: "up" | "down",
  onclick: () => void,
  disabled: boolean,
  parentLabel: string,
  targetIndex: number,
): HTMLButtonElement {
  return el(
    "button",
    {
      className: `${getClass()}__row-btn`,
      disabled,
      onclick,
      attrs: {
        "aria-label": `Move ${parentLabel} ${type} to position ${targetIndex + 1}`,
      },
    },
    // TODO: Use built-in symbol feature instead of hardcoded text
    type === "up" ? "↑" : "↓",
  );
}

function getUpTarget(index: number): number {
  return index - 1;
}

function getDownTarget(index: number): number {
  return index + 1;
}
