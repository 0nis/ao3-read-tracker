import { ListRowType } from "../config";
import { UserOption } from "../types";
import { PaginatedListSectionBase } from "../base/list";
import { createListRow } from "../base/row";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { getFormattedDate } from "../../../../utils/date";
import { SortDirection } from "../../../../enums/ui";
import { ABBREVIATION } from "../../../../constants/global";
import { IgnoredWork } from "../../../../types/works";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";

class IgnoredListSection extends PaginatedListSectionBase<IgnoredWork> {
  private key: string;

  constructor() {
    const key = `${ABBREVIATION}:ignored-list`;
    super({
      id: SectionId.IGNORE_LIST,
      title: "Ignored Works List",
      key: key,
      allowedOrderBy: ["ignoredAt"],
      defaultPaginationOptions: {
        orderBy: "ignoredAt",
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
  ): Promise<StorageResult<PaginatedResult<IgnoredWork>>> {
    return StorageService.ignoredWorks.paginate(args);
  }

  protected async renderItem(item: IgnoredWork): Promise<HTMLElement> {
    return createListRow({
      type: ListRowType.IGNORED,
      item,
      info: {
        date: getFormattedDate(item.ignoredAt, "/"),
        text: item.reason,
      },
    });
  }
}

export function buildIgnoredListSection() {
  return new IgnoredListSection().mount();
}
