import { SectionId } from "../../../sections";
import { createListRow, createPaginatedListSection } from "./base";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../../types/results";
import { ReadWork } from "../../../../../types/works";
import { el } from "../../../../../utils/ui/dom";
import { getWorkLinkFromId } from "../../../../../utils/ao3";
import { PREFIX } from "../../..";
import {
  getFormattedDate,
  getFormattedDateAsFullText,
} from "../../../../../utils/date";

/**
 * TEMPORARY: Creates a mock paginator for testing without DB.
 */
function makeMockPaginator(total = 200) {
  const all: ReadWork[] = Array.from({ length: total }).map((_, i) => ({
    id: `work-${i + 1}`,
    title: `Work number ${i + 1}`,
    createdAt: Date.now() - i * 1000,
    modifiedAt: Date.now() - i * 1000,
  }));

  return (params: PaginatedParams): PaginatedResult<ReadWork> => {
    const start = params.page * params.pageSize;
    const items = all.slice(start, start + params.pageSize);
    const totalPages = Math.ceil(total / params.pageSize);

    return {
      items,
      page: params.page,
      pageSize: params.pageSize,
      totalItems: total,
      totalPages,
      hasPrev: params.page > 0,
      hasNext: params.page < totalPages - 1,
    };
  };
}

export async function buildReadListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.READ_LIST,
    title: "Read Works List",
    paginator: makeMockPaginator(1000), // TODO: Replace with real paginator
    renderItem,
    pageSize: 10,
  });
}

const renderItem = async (item: ReadWork): Promise<HTMLElement> => {
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
        item.title || "untitled"
      ),
      el("div", { className: `${PREFIX}__list__row__symbols` }, []),
    ]
  );

  return await createListRow({
    id: item.id,
    innerElement,
    srAccessibleLabel: `${
      item.title || "Untitled"
    } - Red ${getFormattedDateAsFullText(item.modifiedAt)}`, // Phonetic spelling of past tense "read" lol this is intentional
    srAccessibleContentSummary: `test summary`,
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<StorageResult<void>> => {
          console.log(`Delete item with id: ${item.id}`);
          return Promise.resolve({ success: true });
        },
        confirmationText: `Are you sure you want to remove "${item.title}" from your read list?`,
        successText: `"${item.title}" has been removed from your read list.`,
      },
    },
  });
};
