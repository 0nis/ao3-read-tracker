import { getListClass } from "../../base/list";
import { State } from "../../types";
import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el } from "../../../../../utils/ui/dom";

export interface PaginationControls {
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  pageInput: HTMLInputElement;
  pageLabel: HTMLElement;
  wrapper: HTMLElement;
}

export function createPaginationControls(): PaginationControls {
  const prevBtn = el(
    "button",
    {
      disabled: true,
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--prev`,
      attrs: { "aria-label": "Previous page" },
    },
    ["Prev"]
  ) as HTMLButtonElement;

  const nextBtn = el(
    "button",
    {
      disabled: true,
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--next`,
      attrs: { "aria-label": "Next page" },
    },
    ["Next"]
  ) as HTMLButtonElement;

  const pageInput = el("input", {
    className: `${getListClass()}-pagination__controls-input`,
    attrs: {
      type: "number",
      min: "1",
      "aria-label": "Go to page number",
    },
  });

  const pageLabel = el(
    "span",
    { className: `${getListClass()}-pagination__controls-label` },
    [
      el("span", {}, ["Page "]) as HTMLElement,
      pageInput as HTMLElement,
      el("span", {}, [" of "]) as HTMLElement,
      el("span", {}, ["1"]) as HTMLElement,
    ]
  );

  const wrapper = el(
    "nav",
    {
      className: `${getListClass()}-pagination__controls`,
      attrs: { "aria-label": "Pagination Controls" },
    },
    [prevBtn, pageLabel, nextBtn]
  );

  return {
    prevBtn,
    nextBtn,
    pageInput,
    pageLabel,
    wrapper,
  };
}

export function setupPaginationEvents(
  paginationControls: PaginationControls,
  state: State,
  renderPage: () => Promise<void>
) {
  paginationControls.prevBtn.addEventListener("click", async () => {
    if (state.currentPage > 1) state.currentPage--;
    await renderPage();
  });

  paginationControls.nextBtn.addEventListener("click", async () => {
    if (state.currentPage < (state.totalPages || 1)) state.currentPage++;
    await renderPage();
  });

  paginationControls.pageInput.setAttribute(
    "max",
    String(state.totalPages || 1)
  );
  paginationControls.pageInput.addEventListener("change", async () => {
    const inputPage = parseInt(
      (paginationControls.pageInput as HTMLInputElement).value,
      10
    );
    if (
      !isNaN(inputPage) &&
      inputPage > 0 &&
      inputPage <= (state.totalPages || 1)
    ) {
      state.currentPage = inputPage;
      await renderPage();
    }
  });
}
