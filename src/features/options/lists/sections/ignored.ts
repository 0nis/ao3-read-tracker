import { createPaginatedListSection } from "../base/list.old";
import { createListRow } from "../base/row";

import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/row/content";
import { getSrAccessibleContentSummary } from "../helpers/row/accessibility";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { handleStorageWrite } from "../../../../utils/storage";
import { getWorkLinkFromId } from "../../../../utils/ao3";
import {
  getFormattedDate,
  getFormattedDateAsFullText,
} from "../../../../utils/date";
import { IgnoredWork } from "../../../../types/works";
import { PaginatedListSectionBase } from "../base/list";
import {
  PaginatedParams,
  PaginatedResult,
  StorageResult,
} from "../../../../types/results";
import { SortDirection } from "../../../../enums/ui";

class IgnoredListSection extends PaginatedListSectionBase<IgnoredWork> {
  constructor() {
    super({
      id: SectionId.IGNORE_LIST,
      title: "Ignored Works List",
      allowedOrderBy: ["ignoredAt"],
      defaultUserOptions: {
        orderBy: "ignoredAt",
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
  ): Promise<StorageResult<PaginatedResult<IgnoredWork>>> {
    return StorageService.ignoredWorks.paginate(args);
  }

  protected async renderItem(item: IgnoredWork): Promise<HTMLElement> {
    const info: SupplementaryRowInformation = {
      date: getFormattedDate(item.ignoredAt, "/"),
      text: item.reason,
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
      } - Ignored ${getFormattedDateAsFullText(item.ignoredAt)}`,
      srAccessibleContentSummary: getSrAccessibleContentSummary(info),
      actions: {
        link: { href: getWorkLinkFromId(item.id) },
        delete: {
          onDelete: (): Promise<void> => {
            return handleStorageWrite<void>(
              StorageService.ignoredWorks.delete(item.id),
              {
                successMsg: `${item.title} has been removed from your ignored list.`,
                errorMsg: `Failed to remove ${item.title} from your ignored list.`,
              }
            );
          },
          confirmationText: `Are you sure you want to remove ${item.title} from your ignored list?`,
          successText: `${item.title} has been removed from your ignored list.`,
        },
      },
    });
  }
}

export function buildIgnoredListSection() {
  return new IgnoredListSection().mount();
}
