import { getClass } from "./part";
import { DisplayModeRow, DisplayModeRowOptions } from "./types";

import { el } from "../../../../../../utils/ui/dom";
import { DisplayMode } from "../../../../../../enums/settings";
import { toTitleCase } from "../../../../../../utils/string";

export function createDisplayModeRow({
  mode,
  index,
  total,
  onMoveUp,
  onMoveDown,
}: DisplayModeRowOptions): DisplayModeRow {
  const upBtn = buildUpBtn(onMoveUp, index === 0);
  const downBtn = buildDownBtn(onMoveDown, index === total - 1);

  const indexEl = buildRowIndex(index);

  const elRef = el("div", { className: `${getClass()}__row` }, [
    el("div", { className: `${getClass()}__row-content` }, [
      indexEl,
      buildRowLabel(mode),
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
  };
}

function buildRowIndex(index: number): HTMLElement {
  return el(
    "span",
    { className: `${getClass()}__row-index` },
    String(index + 1),
  );
}

function buildRowLabel(mode: DisplayMode): HTMLElement {
  return el(
    "span",
    { className: `${getClass()}__row-label` },
    toTitleCase(mode),
  );
}

// TODO: Use built-in symbol feature instead of hardcoded text
function buildUpBtn(onclick: () => void, disabled: boolean): HTMLButtonElement {
  return el(
    "button",
    {
      className: `${getClass()}__row-btn`,
      disabled,
      onclick,
    },
    "↑",
  );
}

// TODO: Use built-in symbol feature instead of hardcoded text
function buildDownBtn(
  onclick: () => void,
  disabled: boolean,
): HTMLButtonElement {
  return el(
    "button",
    {
      className: `${getClass()}__row-btn`,
      disabled,
      onclick,
    },
    "↓",
  );
}
