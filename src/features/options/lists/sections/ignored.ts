import { createPaginatedListSection } from "../base/list.old";
import { createListRow } from "../base/row";

import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/content";
import { getSrAccessibleContentSummary } from "../helpers/accessibility";
import { SectionId } from "../../config";

import { StorageService } from "../../../../services/storage";
import { handleStorageWrite } from "../../../../utils/storage";
import { getWorkLinkFromId } from "../../../../utils/ao3";
import {
  getFormattedDate,
  getFormattedDateAsFullText,
} from "../../../../utils/date";
import { IgnoredWork } from "../../../../types/works";

export async function buildIgnoreListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.IGNORE_LIST,
    title: "Ignored Works List",
    paginator: StorageService.ignoredWorks.paginate,
    renderItem,
    pageSize: 10,
    orderBy: "ignoredAt",
  });
}

async function renderItem(item: IgnoredWork): Promise<HTMLElement> {
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
