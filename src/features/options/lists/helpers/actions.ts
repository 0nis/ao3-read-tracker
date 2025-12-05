import { PREFIX } from "../..";
import { SymbolId } from "../../../../enums/symbols";
import { showConfirm } from "../../../../utils/ui/dialogs";
import { el } from "../../../../utils/ui/dom";
import { getSymbolElement } from "../../../../utils/ui/symbols";
import { ListRowActions } from "../base";

export async function createActionButtons(
  actions: ListRowActions,
  row: HTMLElement
): Promise<HTMLElement[]> {
  const buttonPromises: Promise<HTMLElement>[] = [];

  if (actions?.link) {
    buttonPromises.push(createLinkBtn(actions.link.href));
  }

  if (actions?.delete?.onDelete) {
    buttonPromises.push(
      createDeleteBtn(() => {
        const confirmed = showConfirm(
          actions!.delete!.confirmationText ||
            "Are you sure you want to delete this item?"
        );
        if (!confirmed) return;
        actions!.delete!.onDelete().then(() => {
          row.remove();
        });
      })
    );
  }

  return Promise.all(buttonPromises);
}

export async function createDeleteBtn(
  onDelete: () => void
): Promise<HTMLButtonElement> {
  let innerEl = await getSymbolElement(SymbolId.DELETE, "🗑︎");
  const deleteBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--row-delete`,
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
      className: `${PREFIX}__button ${PREFIX}__button--row-link`,
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
