import { CLASS_PREFIX } from "../../../../../../constants/classes";
import { DEFAULT_SYMBOL_SIZE_EM } from "../../../../../../constants/global";
import { SymbolId } from "../../../../../../enums/symbols";
import { el } from "../../../../../../utils/dom";
import { renderSymbolContentById } from "../../../../../../utils/ui/symbols";

export async function createDeleteBtn(
  onDelete: () => void,
): Promise<HTMLButtonElement> {
  let innerEl = await renderSymbolContentById(SymbolId.DELETE, "🗑︎", {
    sizeOverride: DEFAULT_SYMBOL_SIZE_EM,
  });
  const deleteBtn = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--row-delete`,
      title: "Delete this item",
      attrs: {
        "aria-label": "Delete this item",
      },
    },
    [innerEl],
  ) as HTMLButtonElement;
  deleteBtn.addEventListener("click", onDelete);
  return deleteBtn;
}

export async function createLinkBtn(href: string): Promise<HTMLAnchorElement> {
  let innerEl = await renderSymbolContentById(SymbolId.LINK, "↗", {
    sizeOverride: DEFAULT_SYMBOL_SIZE_EM,
  });
  const linkBtn = el(
    "a",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--row-link`,
      title: "Open work in new tab",
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      attrs: {
        "aria-label": "Open work in new tab",
      },
    },
    [innerEl],
  ) as HTMLAnchorElement;
  return linkBtn;
}
