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
import { FinishedWork } from "../../../../types/works";
import { PaginatedListSectionBase } from "../base/list";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { SortDirection } from "../../../../enums/ui";

class FinishedListSection extends PaginatedListSectionBase<FinishedWork> {
  constructor() {
    super({
      id: SectionId.FINISHED_LIST,
      title: "Finished Works List",
      allowedOrderBy: ["finishedAt"],
      defaultUserOptions: {
        orderBy: "finishedAt",
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
  ): Promise<StorageResult<PaginatedResult<FinishedWork>>> {
    return StorageService.finishedWorks.paginate(args);
  }

  protected async renderItem(item: FinishedWork): Promise<HTMLElement> {
    const { symbols, rules } = await loadSymbolsAndRules(item.id, {
      finishedWork: item,
    });

    const info: SupplementaryRowInformation = {
      date: getFormattedDate(item.finishedAt, "/"),
      symbols: {
        symbolData: symbols,
        rules,
        exclude: [SymbolId.FINISHED],
      },
      status: item.finishedStatus,
    };

    const inner = await createInnerElement({ item, ...info });

    return createListRow({
      id: item.id,
      innerElement: inner,
      srAccessibleLabel: `${
        item.title || "Untitled"
      } - Finished ${getFormattedDateAsFullText(item.finishedAt)}`,
      srAccessibleContentSummary: getSrAccessibleContentSummary(info),

      actions: {
        link: { href: getWorkLinkFromId(item.id) },
        delete: {
          onDelete: () =>
            handleStorageWrite(StorageService.finishedWorks.delete(item.id), {
              successMsg: `${item.title} removed.`,
              errorMsg: `Failed to remove ${item.title}.`,
            }),
          confirmationText: `Remove ${item.title}?`,
          successText: `${item.title} removed.`,
        },
      },
    });
  }
}

export function buildFinishedListSection() {
  return new FinishedListSection().mount();
}
