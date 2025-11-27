import { IgnoredWork } from "@types";
import { getWorkLinkFromId } from "@utils/ao3";
import { getFormattedDateAsFullText } from "@utils/date";
import { handleStorageWrite } from "@utils/storage";
import { StorageService } from "@services/storage";

import { SectionId } from "../../config";
import { createListRow, createPaginatedListSection } from "../base";
import {
  createInnerElement,
  SupplementaryRowInformation,
} from "../helpers/content";
import { getSrAccessibleContentSummary } from "../helpers/accessibility";

export async function buildIgnoreListSection(): Promise<HTMLElement> {
  return createPaginatedListSection({
    id: SectionId.IGNORE_LIST,
    title: "Ignored Works List",
    paginator: StorageService.ignoredWorks.paginate,
    renderItem,
    pageSize: 10,
  });
}

async function renderItem(item: IgnoredWork): Promise<HTMLElement> {
  const info: SupplementaryRowInformation = {
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
    } - Ignored ${getFormattedDateAsFullText(item.modifiedAt)}`,
    srAccessibleContentSummary: getSrAccessibleContentSummary(info),
    actions: {
      link: { href: getWorkLinkFromId(item.id) },
      delete: {
        onDelete: (): Promise<void> => {
          return handleStorageWrite<void>(
            StorageService.ignoredWorks.delete(item.id),
            `${item.title} has been removed from your ignored list.`,
            `Failed to remove ${item.title} from your ignored list.`
          );
        },
        confirmationText: `Are you sure you want to remove ${item.title} from your ignored list?`,
        successText: `${item.title} has been removed from your ignored list.`,
      },
    },
  });
}
