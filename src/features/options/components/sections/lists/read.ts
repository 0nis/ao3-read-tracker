import { SectionId } from "../../../sections";
import { createListRow, createPaginatedListSection } from "./base";
import { ReadWork } from "../../../../../types/works";
import { getWorkLinkFromId } from "../../../../../utils/ao3";
import { getFormattedDateAsFullText } from "../../../../../utils/date";
import { symbolsCache } from "../../../../../services/cache/symbols";
import { getActiveSymbolRules } from "../../../../../services/rules/symbols";
import { StorageService } from "../../../../../services/storage";
import {
  createInnerElement,
  SupplementaryRowInformation,
} from "./helpers/content";
import { getSrAccessibleContentSummary } from "./helpers/accessibility";
import { SymbolId } from "../../../../../enums/symbols";
import { handleStorageWrite } from "../../../../../utils/storage/handlers";

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
  const symbols = await symbolsCache.get();
  const rules = getActiveSymbolRules({
    read: item,
    ignored: (await StorageService.ignoredWorks.getById(item.id))?.data,
  });

  const info: SupplementaryRowInformation = {
    symbols: {
      symbolData: symbols,
      rules,
      exclude: [SymbolId.READ], // Everything is read in this list, so exclude the "read" symbol
    },
  };

  const innerElement = await createInnerElement({
    item,
    ...info,
  });

  return await createListRow({
    id: item.id,
    innerElement,
    srAccessibleLabel: `${
      item.title || "Untitled"
    } - Red ${getFormattedDateAsFullText(item.modifiedAt)}`, // Phonetic spelling of past tense "read" lol this is intentional
    srAccessibleContentSummary: getSrAccessibleContentSummary(info),
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<void> => {
          return handleStorageWrite<void>(
            StorageService.readWorks.delete(item.id),
            `${item.title} has been removed from your read list.`,
            `Failed to remove ${item.title} from your read list.`
          );
        },
        confirmationText: `Are you sure you want to remove ${item.title} from your read list?`,
        successText: `${item.title} has been removed from your read list.`,
      },
    },
  });
}
