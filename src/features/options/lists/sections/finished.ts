import { ListRowType } from "../config";
import { UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getFormattedDate } from "../../../../utils/date";
import { SymbolId } from "../../../../enums/symbols";
import { SortDirection } from "../../../../enums/ui";
import { FinishedWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { toggleSwitch } from "../../../../utils/ui/forms";

class FinishedListSection extends PaginatedListSectionBase<FinishedWork> {
  constructor() {
    super({
      id: SectionId.FINISHED_LIST,
      title: "Finished Works List",
      allowedOrderBy: ["finishedAt"],
      defaultOptions: {
        orderBy: "finishedAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });
  }

  protected getCustomUserOptions(): Record<string, UserOption<any>> {
    // return {
    //   showSymbols: {
    //     label: "Show Symbols",
    //     input: toggleSwitch("finished-list-show-symbols-toggle"),
    //   },
    //   showStatus: {
    //     label: "Show Status",
    //     input: toggleSwitch("finished-list-show-status-toggle"),
    //   },
    // };
    return {};
  }

  protected paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<FinishedWork>>> {
    return StorageService.finishedWorks.paginate(args);
  }

  protected async renderItem(item: FinishedWork): Promise<HTMLElement> {
    return createListRow({
      type: ListRowType.FINISHED,
      item,
      info: {
        date: getFormattedDate(item.finishedAt, "/"),
        symbols: {
          ...(await loadSymbolsAndRules(item.id, {
            finishedWork: item,
          })),
          exclude: [SymbolId.FINISHED],
        },
        status: item.finishedStatus,
      },
    });
  }
}

export function buildFinishedListSection() {
  return new FinishedListSection().mount();
}
