import {
  createPaginationControls,
  setupPaginationEvents,
} from "../helpers/pagination";
import { getStyles } from "../style";

import { createSectionWrapper } from "../../components/section";

import { handleStorageRead } from "../../../../utils/storage";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { reportSrLive } from "../../../../utils/ui/accessibility";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { PaginatedResult } from "../../../../types/results";
import { PaginatedListSectionConfig, State } from "../types";

export const LIST_CLASS = `${CLASS_PREFIX}__list`;

export function createPaginatedListSection<T>({
  paginator,
  renderItem,
  orderBy,
  pageSize = 10,
  reverse = false,
  ...config
}: PaginatedListSectionConfig<T>): HTMLElement {
  const state: State = { currentPage: 0 };

  const section = createSectionWrapper(config);
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
