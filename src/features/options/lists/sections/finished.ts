import { ListRowType } from "../config";
import { UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { loadSymbolsAndRules } from "../helpers/row/symbols";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getFormattedDate } from "../../../../utils/date";
import { toggleSwitch } from "../../../../utils/ui/forms";
import { SymbolId } from "../../../../enums/symbols";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { FinishedWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { localMemory } from "../../../../services/memory";

interface FinishedListUserOptions {
  showSymbols: boolean;
  showStatus: boolean;
}

class FinishedListSection extends PaginatedListSectionBase<FinishedWork> {
  private key: string;

  constructor() {
    const key = `${ABBREVIATION}.finished-list`.toLowerCase();
    super({
      id: SectionId.FINISHED_LIST,
      title: "Finished Works List",
      key: key,
      allowedOrderBy: ["finishedAt"],
      defaultPaginationOptions: {
        orderBy: "finishedAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });
    this.key = key;
  }

  protected getCustomUserOptions(): Record<string, UserOption<any>> {
    return {
      showSymbols: {
        label: "Show Symbols",
        input: toggleSwitch("finished-list-show-symbols-toggle"),
        onChange: (value: boolean) => {
          localMemory.set(`${this.key}-showSymbols`, value ? "true" : "false");
        },
      },
      showStatus: {
        label: "Show Status",
        input: toggleSwitch("finished-list-show-status-toggle"),
        onChange: (value: boolean) => {
          localMemory.set(`${this.key}-showStatus`, value ? "true" : "false");
        },
      },
    };
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
