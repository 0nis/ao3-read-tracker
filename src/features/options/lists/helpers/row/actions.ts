import { CLASS_PREFIX } from "../../../../../constants/classes";
import { SymbolId } from "../../../../../enums/symbols";
import { el } from "../../../../../utils/ui/dom";
import { getSymbolElement } from "../../../../../utils/ui/symbols";

export async function createDeleteBtn(
  onDelete: () => void
): Promise<HTMLButtonElement> {
  let innerEl = await getSymbolElement(SymbolId.DELETE, "🗑︎");
  const deleteBtn = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--row-delete`,
      title: "Delete this item",
      attrs: {
        "aria-label": "Delete this item",
      },
    },
    [innerEl]
  ) as HTMLButtonElement;
  deleteBtn.addEventListener("click", onDelete);
  return deleteBtn;
}

export async function createLinkBtn(href: string): Promise<HTMLAnchorElement> {
  let innerEl = await getSymbolElement(SymbolId.LINK, "↗");
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
    [innerEl]
  ) as HTMLAnchorElement;
  return linkBtn;
}
