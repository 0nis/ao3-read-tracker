import { PREFIX } from "../../../..";
import { SymbolId } from "../../../../../../enums/symbols";
import { handleStorageWrite } from "../../../../../../utils/storage/handlers";
import { showConfirm } from "../../../../../../utils/ui/dialogs";
import { el } from "../../../../../../utils/ui/dom";
import { getSymbolElement } from "../../../../../../utils/ui/symbols";
import { reportSrLive } from "../../../../../../utils/ui/srLive";
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
        handleStorageWrite<void>(
          actions!.delete!.onDelete!(),
          actions!.delete!.successText || `Item has been deleted.`,
          `Failed to delete item.`
        ).then(() => {
          row.remove();
        });
      })
    );
  }

  return Promise.all(buttonPromises);
}

export function attachExpandableBehavior(
  row: HTMLElement,
  innerEl: HTMLElement,
  actionsWrapper: HTMLElement,
  actionEls: HTMLElement[],
  srContentSummary: string
) {
  function collapse() {
    row.setAttribute("aria-expanded", "false");
    innerEl.setAttribute("aria-hidden", "true");
    actionsWrapper.setAttribute("aria-hidden", "true");
    actionEls.forEach((btn) => (btn.tabIndex = -1));
  }

  function expand() {
    row.setAttribute("aria-expanded", "true");
    innerEl.setAttribute("aria-hidden", "false");
    actionsWrapper.setAttribute("aria-hidden", "false");
    actionEls.forEach((btn) => (btn.tabIndex = 0));
    reportSrLive(srContentSummary);
  }

  actionEls.forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });

  row.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      collapse();
    }
  });

  row.addEventListener("click", () => {
    const isExpanded = row.getAttribute("aria-expanded") === "true";
    if (isExpanded) collapse();
    else expand();
  });

  row.addEventListener(
    "blur",
    (e: FocusEvent) => {
      const next = e.relatedTarget;
      if (!(next instanceof Node) || !row.contains(next)) {
        collapse();
      }
    },
    true
  );

  return { collapse, expand };
}

export async function createDeleteBtn(
  onDelete: () => void
): Promise<HTMLButtonElement> {
  let innerEl = await getSymbolElement(SymbolId.DELETE, "🗑︎");
  const deleteBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--row-delete`,
      title: "Delete",
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
      title: "Open",
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      attrs: {
        "aria-label": "Open link in new tab",
      },
    },
    [innerEl]
  ) as HTMLAnchorElement;
  return linkBtn;
}
