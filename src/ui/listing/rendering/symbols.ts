import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkState } from "../../../types/enums";
import { IgnoredFic, ReadFic } from "../../../types/storage";
import { getOrCreateElement } from "../../../utils/dom";

/**
 * Adds symbols to a work element showing information like read/ignored status, reread worthiness, and read count.
 * @param work The fic to modify
 * @param type What type of information the text is for, like a fic marked as read or ignored
 * @param item The item data containing optional additional information
 */
export function addSymbols(
  work: HTMLElement,
  type: WorkState,
  item: ReadFic | IgnoredFic
) {
  addStyles();

  const symbolIndicatorList = getOrCreateElement(
    work,
    `${CLASS_PREFIX}__symbol-indicator`,
    "ul"
  );

  if (type === WorkState.READ)
    renderReadSymbol(symbolIndicatorList, item as ReadFic);
  else renderIgnoredSymbol(symbolIndicatorList, item as IgnoredFic);

  work.querySelector(".header.module")?.appendChild(symbolIndicatorList);
}

function renderReadSymbol(indicatorList: HTMLElement, item: ReadFic) {
  addListItemToIndicator(indicatorList, "✅", "Marked as read");
  if (item.reread)
    addListItemToIndicator(indicatorList, "🔁", "Marked as re-read worthy");
  if (item.count)
    addListItemToIndicator(
      indicatorList,
      `📚x${item.count}`,
      `Read ${item.count} ${item.count === 1 ? "time" : "times"}`
    );
}

function renderIgnoredSymbol(indicatorList: HTMLElement, item: IgnoredFic) {
  addListItemToIndicator(indicatorList, "🚫", "Marked as ignored");
}

function addListItemToIndicator(
  indicatorList: HTMLElement,
  text: string,
  label: string
) {
  const listItem = document.createElement("li");
  listItem.setAttribute("aria-label", label);
  listItem.setAttribute("title", label);

  const symbolSpan = document.createElement("span");
  symbolSpan.textContent = text;
  // Don't torture screen reader users with emoji readouts
  symbolSpan.setAttribute("aria-hidden", "true");

  listItem.appendChild(symbolSpan);
  indicatorList.appendChild(listItem);
}

function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__symbol-indicator {
      display: inline !important;
      margin: 0 !important;
      float: right;
      position: absolute;
      top: 20px;
      right: 0px;
    }
  `;
  document.head.appendChild(style);
}
