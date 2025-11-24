import { SectionId } from "../../../sections";
import { createListRow, createListSection, ListSectionElements } from "./base";
import { listSectionRegistry } from "./registry";
import {
  ReadFic,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/storage";
import { el } from "../../../../../utils/ui/dom";
import { getWorkLinkFromId } from "../../../../../utils/ao3";
import { PREFIX } from "../../..";
import { getFormattedDate } from "../../../../../utils/date";

/**
 * TEMPORARY: Creates a mock paginator for testing without DB.
 */
function makeMockPaginator(total = 200) {
  const all: ReadFic[] = Array.from({ length: total }).map((_, i) => ({
    id: `fic-${i + 1}`,
    title: `Fic number ${i + 1}`,
    createdAt: Date.now() - i * 1000,
    modifiedAt: Date.now() - i * 1000,
  }));

  return (page: number, pageSize: number): PaginatedResult<ReadFic> => {
    const start = page * pageSize;
    const items = all.slice(start, start + pageSize);
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      page,
      pageSize,
      totalItems: total,
      totalPages,
      hasPrev: page > 0,
      hasNext: page < totalPages - 1,
    };
  };
}

export function buildReadListSection(): HTMLElement {
  const elements: ListSectionElements = createListSection({
    id: SectionId.READ_LIST,
    title: "Read Works List",
  });

  listSectionRegistry.set(SectionId.READ_LIST, elements);

  const pageSize = 25;
  const paginator = makeMockPaginator(1000); // TODO: Replace with real paginator
  let currentPage = 0;

  function renderPage() {
    const result = paginator(currentPage, pageSize);
    const { items, page, totalPages } = result;

    elements.listContainer.innerHTML = "";
    items.forEach((item) => {
      const link = getWorkLinkFromId(item.id);

      const innerElement = el(
        "div",
        { className: `${PREFIX}__list__row__content` },
        [
          el(
            "span",
            { className: `${PREFIX}__list__row__date` },
            getFormattedDate(item.modifiedAt)
          ),
          el(
            "div",
            { className: `${PREFIX}__list__row__title` },
            el(
              "a",
              {
                href: link,
                target: "_blank",
                rel: "noopener noreferrer",
              },
              item.title ?? "(untitled)"
            )
          ),
        ]
      );

      elements.listContainer.appendChild(
        createListRow({
          id: item.id,
          innerElement,
          ariaLabel: item.title ?? "untitled",
          actions: {
            link: { href: link },
            delete: {
              onDelete: (): Promise<StorageResult<void>> => {
                console.log(`Delete item with id: ${item.id}`);
                return Promise.resolve({ success: true });
              },
              confirmationText: `Are you sure you want to remove "${item.title}" from your read list?`,
              successText: `"${item.title}" has been removed from your read list.`,
            },
          },
        })
      );
    });

    elements.paginationControls.pageLabel.textContent = `Page ${
      page + 1
    } of ${totalPages}`;
    elements.paginationControls.prevBtn.disabled = !result.hasPrev;
    elements.paginationControls.nextBtn.disabled = !result.hasNext;
  }

  elements.paginationControls.prevBtn.addEventListener("click", () => {
    if (currentPage > 0) currentPage--;
    renderPage();
  });

  elements.paginationControls.nextBtn.addEventListener("click", () => {
    currentPage++;
    renderPage();
  });

  renderPage();

  return elements.section;
}
