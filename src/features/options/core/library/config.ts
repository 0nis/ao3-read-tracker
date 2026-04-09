import { StorageService } from "../../../../services/storage/storage";
import { StorageResult } from "../../../../types/storage";
import {
  FinishedWork,
  IgnoredWork,
  InProgressWork,
} from "../../../../types/works";

export enum ListRowType {
  FINISHED = `finished`,
  IN_PROGRESS = `in_progress`,
  IGNORED = `ignore`,
}

export interface ListRowTypeMap {
  [ListRowType.FINISHED]: FinishedWork;
  [ListRowType.IN_PROGRESS]: InProgressWork;
  [ListRowType.IGNORED]: IgnoredWork;
}

export interface ListRowTypeMessagesEntry {
  srAccessibleLabel: string;
  delete: {
    confirmation: string;
    success: string;
    error: string;
  };
}

export const LIST_ROW_MESSAGES_MAP: {
  [K in ListRowType]: ListRowTypeMessagesEntry;
} = {
  [ListRowType.FINISHED]: {
    srAccessibleLabel: "%title% - Finished %date%",
    delete: {
      confirmation:
        "Are you sure you want to remove %title% from your finished list?",
      success: "%title% has been removed from your finished list.",
      error: "Failed to remove %title% from your finished list.",
    },
  },
  [ListRowType.IN_PROGRESS]: {
    srAccessibleLabel: "%title% - Last red %date%", // Phonetic spelling of past tense "read" lol this is intentional
    delete: {
      confirmation: "Are you sure you want to stop reading %title%?",
      success: "Successfully stopped reading %title%.",
      error: "Failed to stop reading %title%.",
    },
  },
  [ListRowType.IGNORED]: {
    srAccessibleLabel: "%title% - Ignored %date%",
    delete: {
      confirmation: "Are you sure you want to stop ignoring %title%?",
      success: "%title% will no longer be ignored.",
      error: "Failed to remove %title% from your ignored list.",
    },
  },
};

export const LIST_ROW_TYPE_SERVICE_MAP: {
  [K in ListRowType]: {
    deleter: (id: string) => Promise<StorageResult<void>>;
  };
} = {
  [ListRowType.FINISHED]: {
    deleter: StorageService.finishedWorks.delete,
  },
  [ListRowType.IN_PROGRESS]: {
    deleter: StorageService.inProgressWorks.delete,
  },
  [ListRowType.IGNORED]: {
    deleter: StorageService.ignoredWorks.delete,
  },
};
