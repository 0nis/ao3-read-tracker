import { createListRow, createPaginatedListSection } from "../base";
import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/content";
import { getSrAccessibleContentSummary } from "../helpers/accessibility";
import { loadSymbolsAndRules } from "../helpers/symbols";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { handleStorageWrite } from "../../../../utils/storage";
import { getWorkLinkFromId } from "../../../../utils/ao3";
import {
  getFormattedDate,
  getFormattedDateAsFullText,
} from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { InProgressWork } from "../../../../types/works";

export async function buildInProgressListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.IN_PROGRESS_LIST,
    title: "In Progress Works List",
    paginator: StorageService.inProgressWorks.paginate,
    renderItem,
    pageSize: 10,
    orderBy: "lastReadAt",
  });
}

async function renderItem(item: InProgressWork): Promise<HTMLElement> {
  const { symbols, rules } = await loadSymbolsAndRules(item.id, {
    inProgressWork: item,
  });

  const info: SupplementaryRowInformation = {
    date: getFormattedDate(item.lastReadAt, "/"),
    symbols: {
      symbolData: symbols,
      rules,
      exclude: [SymbolId.IN_PROGRESS], // Everything is in progress in this list, so exclude the "in progress" symbol
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
    } - Last red ${getFormattedDateAsFullText(item.lastReadAt)}`, // Phonetic spelling of past tense "read" lol this is intentional
    srAccessibleContentSummary: getSrAccessibleContentSummary(info),
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<void> => {
          return handleStorageWrite<void>(
            StorageService.inProgressWorks.delete(item.id),
            {
              successMsg: `${item.title} has been removed from your in progress list.`,
              errorMsg: `Failed to remove ${item.title} from your in progress list.`,
            }
          );
        },
        confirmationText: `Are you sure you want to remove ${item.title} from your in progress list?`,
        successText: `${item.title} has been removed from your in progress list.`,
      },
    },
  });
}
