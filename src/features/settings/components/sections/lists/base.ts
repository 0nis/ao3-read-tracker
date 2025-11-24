import { PREFIX } from "../../..";
import { StorageResult } from "../../../../../types/storage";
import { handleStorageWrite } from "../../../../../utils/storage/handlers";
import { showConfirm } from "../../../../../utils/ui/dialogs";
import { el, injectStyles } from "../../../../../utils/ui/dom";
import { createFlashNotice } from "../../../../../utils/ui/form";
import { createSection, SectionConfig } from "../helpers";
import { getStyles } from "./style";

export interface ListSectionConfig extends SectionConfig {}

export interface ListSectionElements {
  section: HTMLElement;
  listContainer: HTMLElement;
  paginationControls: {
    wrapper: HTMLElement;
    prevBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    pageLabel: HTMLElement;
  };
  bulkActions: {
    wrapper: HTMLElement;
    deleteBtn: HTMLButtonElement;
  };
}

export function createListSection(
  config: ListSectionConfig
): ListSectionElements {
  const section = createSection(config);
  injectStyles(`${PREFIX}__styles--list-section`, getStyles(PREFIX));

  const listContainer = el("ul", {
    className: `${PREFIX}__list__container`,
    role: "list",
  });

  const prevBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--prev`,
      disabled: true,
    },
    ["Prev"]
  ) as HTMLButtonElement;

  const nextBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--next`,
      disabled: true,
    },
    ["Next"]
  ) as HTMLButtonElement;

  const pageLabel = el(
    "span",
    {
      className: `${PREFIX}__pagination__label`,
    },
    ["Page 1"]
  );

  const paginationWrapper = el(
    "div",
    {
      className: `${PREFIX}__pagination`,
    },
    [prevBtn, pageLabel, nextBtn]
  );

  const deleteBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--delete`,
      disabled: true,
    },
    ["Delete Selected"]
  ) as HTMLButtonElement;

  const bulkActionsWrapper = el(
    "div",
    {
      className: `${PREFIX}__bulk__actions`,
    },
    [deleteBtn]
  );

  section.appendChild(listContainer);
  section.appendChild(paginationWrapper);
  section.appendChild(bulkActionsWrapper);

  return {
    section,
    listContainer,
    paginationControls: {
      wrapper: paginationWrapper,
      prevBtn,
      nextBtn,
      pageLabel,
    },
    bulkActions: {
      wrapper: bulkActionsWrapper,
      deleteBtn,
    },
  };
}

export interface ListRow {
  id: string;
  innerElement: HTMLElement;
  ariaLabel: string;
  actions?: {
    link?: {
      href: string;
    };
    delete?: {
      onDelete: () => Promise<StorageResult<void>>;
      confirmationText: string;
      successText: string;
    };
  };
}

export function createListRow({
  id,
  innerElement,
  ariaLabel,
  actions,
}: ListRow): HTMLElement {
  const row = el(
    "li",
    {
      id: id,
      className: `${PREFIX}__list__row`,
      tabIndex: 0,
      ariaLabel: ariaLabel,
      role: "listitem",
    },
    [innerElement]
  );

  const actionEls: HTMLElement[] = [];

  if (actions?.link) {
    actionEls.push(createLinkBtn(actions.link.href));
  }

  if (actions?.delete?.onDelete) {
    const deleteBtn = createDeleteBtn(() => {
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
    });
    actionEls.push(deleteBtn);
  }

  row.appendChild(
    el("div", { className: `actions ${PREFIX}__list__row__actions` }, actionEls)
  );
  return row;
}

function createDeleteBtn(onDelete: () => void): HTMLButtonElement {
  const deleteBtn = el(
    "button",
    {
      className: `${PREFIX}__button ${PREFIX}__button--row-delete`,
      ariaLabel: "Delete this item",
      title: "Delete",
    },
    ["🗑︎"]
  ) as HTMLButtonElement;
  deleteBtn.addEventListener("click", onDelete);
  return deleteBtn;
}

function createLinkBtn(href: string): HTMLAnchorElement {
  const linkBtn = el(
    "a",
    {
      className: `${PREFIX}__button ${PREFIX}__button--row-link`,
      ariaLabel: "Open item in new tab",
      title: "Open",
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    ["↗"]
  ) as HTMLAnchorElement;
  return linkBtn;
}
