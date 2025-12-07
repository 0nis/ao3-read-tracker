import { attachExpandableBehavior } from "./helpers/accessibility";
import { createActionButtons } from "./helpers/actions";
import {
  createPaginationControls,
  setupPaginationEvents,
} from "./helpers/pagination";
import { getStyles } from "./style";

import { SectionConfig } from "../types";
import { createSection } from "../components/section";

import { handleStorageRead } from "../../../utils/storage";
import { el, injectStyles } from "../../../utils/ui/dom";
import { reportSrLive } from "../../../utils/ui/accessibility";
import { CLASS_PREFIX } from "../../../constants/classes";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../types/results";

export const LIST_CLASS = `${CLASS_PREFIX}__list`;

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  paginator: (
    params: PaginatedParams
  ) => Promise<StorageResult<PaginatedResult<T>>>;
  renderItem: (item: T) => Promise<HTMLElement>;
  orderBy: keyof T;
  pageSize?: number;
  reverse?: boolean;
}

export type State = { currentPage: number; totalPages?: number };

export function createPaginatedListSection<T>({
  paginator,
  renderItem,
  orderBy,
  pageSize = 10,
  reverse = false,
  ...config
}: PaginatedListSectionConfig<T>): HTMLElement {
  const state: State = { currentPage: 0 };

  const section = createSection(config);
  injectStyles(`${CLASS_PREFIX}__styles--list-section`, getStyles(LIST_CLASS));

  const listContainer = el("ul", {
    className: `${LIST_CLASS}__container`,
    role: "list",
  });

  const paginationControls = createPaginationControls();

  async function renderPage(init: boolean = false) {
    listContainer.classList.add(`${LIST_CLASS}__container--loading`);

    const fragment = document.createDocumentFragment();
    const result = await handleStorageRead<PaginatedResult<T>>(
      paginator({
        page: state.currentPage,
        pageSize,
        options: {
          orderBy: orderBy,
          reverse: reverse,
        },
      }),
      {
        errorMsg: "Failed to load list data.",
        fallback: {
          items: [],
          page: 0,
          pageSize,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    );
    const { items, page, totalPages, hasPrev, hasNext } = result;
    state.totalPages = totalPages;

    if (items.length === 0) {
      const emptyEl = el("li", { className: `${LIST_CLASS}__row--empty` }, [
        "No items to display :(",
      ]);
      fragment.appendChild(emptyEl);
    }
    const rendered = await Promise.all(items.map(renderItem));
    rendered.forEach((el) => fragment.appendChild(el));
    listContainer.replaceChildren(fragment);

    (paginationControls.pageLabel.children[1] as HTMLInputElement).value =
      String(page + 1);
    paginationControls.pageLabel.lastChild!.textContent = totalPages.toString();
    paginationControls.prevBtn.disabled = !hasPrev;
    paginationControls.nextBtn.disabled = !hasNext;

    queueMicrotask(() =>
      listContainer.classList.remove(`${LIST_CLASS}__container--loading`)
    );

    if (!init) reportSrLive(`Page ${page + 1} of ${totalPages}`);
  }

  setupPaginationEvents(paginationControls, state, renderPage);

  renderPage(true);

  const paginationWrapper = el(
    "nav",
    {
      className: `${LIST_CLASS}-pagination__controls`,
      attrs: { "aria-label": "Pagination Controls" },
    },
    [
      paginationControls.prevBtn,
      paginationControls.pageLabel,
      paginationControls.nextBtn,
    ]
  );

  section.appendChild(listContainer);
  section.appendChild(paginationWrapper);

  return section;
}

export interface ListRow {
  id: string;
  innerElement: HTMLElement;
  srAccessibleLabel: string;
  srAccessibleContentSummary: string;
  actions?: ListRowActions;
}

export interface ListRowActions {
  link?: {
    href: string;
  };
  delete?: {
    onDelete: () => Promise<void>;
    confirmationText: string;
    successText: string;
  };
}

export async function createListRow({
  id,
  innerElement,
  srAccessibleLabel,
  srAccessibleContentSummary,
  actions = {},
}: ListRow): Promise<HTMLElement> {
  innerElement.setAttribute("aria-hidden", "true");

  const hiddenLabel = el(
    "span",
    {
      id: `${id}-label`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    [srAccessibleLabel]
  );

  const hint = el(
    "span",
    {
      id: `${id}-hint`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    ["Press Enter to show details and actions."]
  );

  const row = el(
    "li",
    {
      id: id,
      className: `${LIST_CLASS}__row`,
      tabIndex: 0,
      attrs: {
        "aria-labelledby": `${id}-label`,
        "aria-describedby": `${id}-label ${id}-hint`,
        "aria-expanded": "false",
      },
    },
    [hiddenLabel, hint, innerElement]
  );

  const actionEls: HTMLElement[] = await createActionButtons(actions, row);
  const actionsWrapper = el(
    "div",
    {
      className: `actions ${LIST_CLASS}__row-actions`,
      attrs: { "aria-hidden": "true" },
    },
    actionEls
  );

  attachExpandableBehavior(
    row,
    innerElement,
    actionsWrapper,
    actionEls,
    srAccessibleContentSummary
  );

  row.appendChild(actionsWrapper);
  return row;
}
