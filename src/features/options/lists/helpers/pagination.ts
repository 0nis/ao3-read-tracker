import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";
import { State } from "../base";

export interface PaginationControls {
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  pageInput: HTMLInputElement;
  pageLabel: HTMLElement;
}

export function createPaginationControls(): PaginationControls {
  const prevBtn = el(
    "button",
    {
      disabled: true,
      className: `${PREFIX}__button ${PREFIX}__button--prev`,
      attrs: { "aria-label": "Previous page" },
    },
    ["Prev"]
  ) as HTMLButtonElement;

  const nextBtn = el(
    "button",
    {
      disabled: true,
      className: `${PREFIX}__button ${PREFIX}__button--next`,
      attrs: { "aria-label": "Next page" },
    },
    ["Next"]
  ) as HTMLButtonElement;

  const pageInput = el("input", {
    className: `${PREFIX}__pagination__input`,
    attrs: {
      type: "number",
      min: "1",
      "aria-label": "Go to page number",
    },
  });

  const pageLabel = el("span", { className: `${PREFIX}__pagination__label` }, [
    el("span", {}, ["Page "]) as HTMLElement,
    pageInput as HTMLElement,
    el("span", {}, [" of "]) as HTMLElement,
    el("span", {}, ["1"]) as HTMLElement,
  ]);

  return {
    prevBtn,
    nextBtn,
    pageInput,
    pageLabel,
  };
}

export function setupPaginationEvents(
  paginationControls: PaginationControls,
  state: State,
  renderPage: () => Promise<void>
) {
  paginationControls.prevBtn.addEventListener("click", async () => {
    if (state.currentPage > 0) state.currentPage--;
    await renderPage();
  });

  paginationControls.nextBtn.addEventListener("click", async () => {
    state.currentPage++;
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
      state.currentPage = inputPage - 1;
      await renderPage();
    }
  });
}
