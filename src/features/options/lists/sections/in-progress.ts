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
import { ABBREVIATION } from "../../../../constants/global";
import { InProgressWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";

class InProgressListSection extends PaginatedListSectionBase<InProgressWork> {
  private key: string;

  constructor() {
    const key = `${ABBREVIATION}.in-progress-list`.toLowerCase();
    super({
      id: SectionId.IN_PROGRESS_LIST,
      title: "In Progress Works List",
      key: key,
      allowedOrderBy: ["lastReadAt"],
      defaultPaginationOptions: {
        orderBy: "lastReadAt",
        sortDirection: SortDirection.DESC,
        pageSize: 10,
      },
    });
    this.key = key;
  }

  protected getCustomUserOptions(): Record<string, UserOption<any>> {
    return {};
  }

  protected paginator(
    args: PaginatedParams
  ): Promise<StorageResult<PaginatedResult<InProgressWork>>> {
    return StorageService.inProgressWorks.paginate(args);
  }

  protected async renderItem(item: InProgressWork): Promise<HTMLElement> {
    return createListRow({
      type: ListRowType.IN_PROGRESS,
      item,
      info: {
        date: getFormattedDate(item.lastReadAt, "/"),
        symbols: {
          ...(await loadSymbolsAndRules(item.id, {
            inProgressWork: item,
          })),
          exclude: [SymbolId.IN_PROGRESS], // Everything is in progress in this list, so exclude the "in progress" symbol
        },
        status: item.readingStatus,
      },
    });
  }

  protected handleCustomOptionChange(key: string, value: unknown): void {}
}

export function buildInProgressListSection() {
  return new InProgressListSection().mount();
}
