import { createPaginatedListSection } from "../base/list.old";
import { createListRow } from "../base/row";
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
import { FinishedWork } from "../../../../types/works";

export async function buildFinishedListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.FINISHED_LIST,
    title: "Finished Works List",
    paginator: StorageService.finishedWorks.paginate,
    renderItem,
    pageSize: 10,
    orderBy: "finishedAt",
  });
}

async function renderItem(item: FinishedWork): Promise<HTMLElement> {
  const { symbols, rules } = await loadSymbolsAndRules(item.id, {
    finishedWork: item,
  });

  const info: SupplementaryRowInformation = {
    date: getFormattedDate(item.finishedAt, "/"),
    symbols: {
      symbolData: symbols,
      rules,
      exclude: [SymbolId.FINISHED], // Everything is finished in this list, so exclude the "finished" symbol
    },
    status: item.finishedStatus,
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
    } - Finished ${getFormattedDateAsFullText(item.finishedAt)}`,
    srAccessibleContentSummary: getSrAccessibleContentSummary(info),
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<void> => {
          return handleStorageWrite<void>(
            StorageService.finishedWorks.delete(item.id),
            {
              successMsg: `${item.title} has been removed from your finished list.`,
              errorMsg: `Failed to remove ${item.title} from your finished list.`,
            }
          );
        },
        confirmationText: `Are you sure you want to remove ${item.title} from your finished list?`,
        successText: `${item.title} has been removed from your finished list.`,
      },
    },
  });
}
