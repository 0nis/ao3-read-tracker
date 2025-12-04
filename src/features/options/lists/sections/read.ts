import { SectionId } from "../../config";
import { createListRow, createPaginatedListSection } from "../base";

import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/content";
import { getSrAccessibleContentSummary } from "../helpers/accessibility";

import { symbolsCache } from "../../../../services/cache/symbols";
import { getActiveSymbolRules } from "../../../../services/rules/symbols";
import { StorageService } from "../../../../services/storage";

import { handleStorageWrite } from "../../../../utils/storage/handlers";
import { getWorkLinkFromId } from "../../../../utils/ao3";
import {
  getFormattedDate,
  getFormattedDateAsFullText,
} from "../../../../utils/date";

import { SymbolId } from "../../../../enums/symbols";
import { ReadWork } from "../../../../types/works";

export async function buildReadListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.READ_LIST,
    title: "Read Works List",
    paginator: StorageService.readWorks.paginate,
    renderItem,
    pageSize: 10,
    orderBy: "finishedAt",
  });
}

async function renderItem(item: ReadWork): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const rules = getActiveSymbolRules({
    readWork: item,
    inProgressWork: (await StorageService.inProgressWorks.getById(item.id))
      ?.data,
    ignoredWork: (await StorageService.ignoredWorks.getById(item.id))?.data,
  });

  const info: SupplementaryRowInformation = {
    date: getFormattedDate(item.finishedAt, "/"),
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
    } - Red ${getFormattedDateAsFullText(item.finishedAt)}`, // Phonetic spelling of past tense "read" lol this is intentional
    srAccessibleContentSummary: getSrAccessibleContentSummary(info),
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<void> => {
          return handleStorageWrite<void>(
            StorageService.readWorks.delete(item.id),
            {
              successMsg: `${item.title} has been removed from your read list.`,
              errorMsg: `Failed to remove ${item.title} from your read list.`,
            }
          );
        },
        confirmationText: `Are you sure you want to remove ${item.title} from your read list?`,
        successText: `${item.title} has been removed from your read list.`,
      },
    },
  });
}
