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
import { symbolsCache } from "../../../../../services/cache/symbols";
import {
  getActiveSymbolRules,
  SymbolRule,
} from "../../../../../services/rules/symbols";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import { SymbolData } from "../../../../../types/symbols";
import { StorageService } from "../../../../../services/storage";

/**
 * TEMPORARY: Creates a mock paginator for testing without DB.
 */
function makeMockPaginator(total = 200) {
  const all: ReadWork[] = Array.from({ length: total }).map((_, i) => ({
    id: `work-${i + 1}`,
    title: `Work number ${i + 1}`,
    createdAt: Date.now() - i * 1000,
    modifiedAt: Date.now() - i * 1000,
    isReading: i % 3 === 0,
    lastReadChapter: i % 5 === 0 ? (i % 10) + 1 : undefined,
    rereadWorthy: i % 7 === 0,
    count: i % 4 === 0 ? Math.floor(i / 4) + 1 : undefined,
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

async function renderItem(item: ReadWork): Promise<HTMLElement> {
  const ignoredWork = await StorageService.ignoredWorks.getById(item.id);

  const symbols = await symbolsCache.get();
  const rules = getActiveSymbolRules({
    read: item,
    ignored: ignoredWork?.data,
  });

  const innerElement = el(
    "div",
    { className: `${PREFIX}__list__row__content` },
    await createInnerElementChildren(item, symbols, rules)
  );

  return await createListRow({
    id: item.id,
    innerElement,
    srAccessibleLabel: `${
      item.title || "Untitled"
    } - Red ${getFormattedDateAsFullText(item.modifiedAt)}`, // Phonetic spelling of past tense "read" lol this is intentional
    srAccessibleContentSummary: getSrAccessibleContentSummary(symbols, rules),
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
}

async function createInnerElementChildren(
  item: ReadWork,
  symbols: SymbolData,
  rules: SymbolRule[]
): Promise<HTMLElement[]> {
  const date = el(
    "span",
    { className: `${PREFIX}__list__row__date` },
    getFormattedDate(item.modifiedAt)
  );

  const title = el(
    "div",
    { className: `${PREFIX}__list__row__title` },
    item.title || "untitled"
  );
  const symbolsElement = await getSymbolElement(symbols, rules);

  const main = el("div", { className: `${PREFIX}__list__row__main` }, [
    title,
    symbolsElement,
  ]);

  return [date, main];
}

async function getSymbolElement(
  symbols: SymbolData,
  rules: SymbolRule[]
): Promise<HTMLElement> {
  const symbolWrapper = el(
    "ul",
    { className: `${PREFIX}__list__row__symbols` },
    []
  );

  for (const rule of rules) {
    const symbol = symbols[rule.id];
    if (!symbol) continue;

    const label = rule.getCustomLabel?.() || symbol.label;
    symbolWrapper.appendChild(
      el(
        "li",
        {
          className: `${PREFIX}__list__row__symbols__item`,
          attrs: {
            "aria-label": label,
            title: label,
          },
        },
        [renderSymbolContent(symbol, rule.getSuffix?.())]
      )
    );
  }

  return symbolWrapper;
}

function getSrAccessibleContentSummary(
  symbols: SymbolData,
  rules: SymbolRule[]
): string {
  const symbolsDescriptions: string[] = [];
  for (const rule of rules) {
    const label = rule.getCustomLabel?.() || symbols[rule.id]?.label;
    if (label) symbolsDescriptions.push(label);
  }
  return symbolsDescriptions.length ? `${symbolsDescriptions.join(", ")}.` : "";
}
