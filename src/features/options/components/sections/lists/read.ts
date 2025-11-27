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

export async function buildReadListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.READ_LIST,
    title: "Read Works List",
    paginator: StorageService.readWorks.paginate,
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
