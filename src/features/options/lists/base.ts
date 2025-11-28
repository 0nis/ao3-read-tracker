import { PREFIX } from "..";
import { CLASS_PREFIX } from "../../../constants/classes";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../types/results";
import { handleStorageRead } from "../../../utils/storage/handlers";
import { el, injectStyles } from "../../../utils/ui/dom";
import { reportSrLive } from "../../../utils/ui/sr-live";
import { createSection, SectionConfig } from "../components/section";
import { attachExpandableBehavior } from "./helpers/accessibility";
import { createActionButtons } from "./helpers/actions";
import {
  createPaginationControls,
  setupPaginationEvents,
} from "./helpers/pagination";
import { getStyles } from "./style";

export interface PaginatedListSectionConfig<T> extends SectionConfig {
  paginator: (
    params: PaginatedParams
  ) => Promise<StorageResult<PaginatedResult<T>>>;
  renderItem: (item: T) => Promise<HTMLElement>;
  pageSize?: number;
}

export type State = { currentPage: number; totalPages?: number };

export function createPaginatedListSection<T>({
  paginator,
  renderItem,
  pageSize = 10,
  ...config
}: PaginatedListSectionConfig<T>): HTMLElement {
  const state: State = { currentPage: 0 };

  const section = createSection(config);
  injectStyles(`${PREFIX}__styles--list-section`, getStyles(PREFIX));

  const listContainer = el("ul", {
    className: `${PREFIX}__list__container`,
    role: "list",
  });

  const paginationControls = createPaginationControls();

  async function renderPage() {
    listContainer.classList.add(`${PREFIX}__list__container--loading`);

    const fragment = document.createDocumentFragment();
    const result = await handleStorageRead<PaginatedResult<T>>(
      paginator({
        page: state.currentPage,
        pageSize,
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
        allowUndefined: true,
      }
    );
    const { items, page, totalPages, hasPrev, hasNext } = result;
    state.totalPages = totalPages;

    if (items.length === 0) {
      const emptyEl = el("li", { className: `${PREFIX}__list__row--empty` }, [
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
      listContainer.classList.remove(`${PREFIX}__list__container--loading`)
    );

    reportSrLive(`Page ${page + 1} of ${totalPages}`);
  }

  setupPaginationEvents(paginationControls, state, renderPage);

  renderPage();

  const paginationWrapper = el(
    "nav",
    {
      className: `${PREFIX}__pagination__controls`,
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
      className: `${PREFIX}__list__row`,
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
      className: `actions ${PREFIX}__list__row__actions`,
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
