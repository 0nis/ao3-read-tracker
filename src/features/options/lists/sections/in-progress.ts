import { createPaginatedListSection } from "../base/list.old";
import { createListRow } from "../base/row";
import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/row/content";
import { getSrAccessibleContentSummary } from "../helpers/row/accessibility";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
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
import { PaginatedListSectionBase } from "../base/list";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { SortDirection } from "../../../../enums/ui";

class InProgressListSection extends PaginatedListSectionBase<InProgressWork> {
  constructor() {
    super({
      id: SectionId.IN_PROGRESS_LIST,
      title: "In Progress Works List",
      allowedOrderBy: ["lastReadAt"],
      defaultUserOptions: {
        orderBy: "lastReadAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });
  }

  protected getCustomUserOptions() {
    return []; // TODO: Add
  }

  protected paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<InProgressWork>>> {
    return StorageService.inProgressWorks.paginate(args);
  }

  protected async renderItem(item: InProgressWork): Promise<HTMLElement> {
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
      status: item.readingStatus,
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
}

export function buildInProgressListSection() {
  return new InProgressListSection().mount();
}
