import { getCurrentChapterFromWorkPage } from "./helpers";
import { IgnoredWork, InProgressWork, FinishedWork } from "../../types/works";
import { ExtensionModule } from "../../enums/settings";
import { WorkState } from "../../enums/works";

export enum WorkAction {
  FINISHED = `finished`,
  IN_PROGRESS = `in_progress`,
  IGNORE = `ignore`,
}

export enum WorkActionState {
  MARKED = "marked",
  UNMARKED = "unmarked",
}

export enum WorkActionEvent {
  SAVE = "save",
  EDIT = "edit",
  DELETE = "delete",
}

export interface WorkActionTypeMap {
  [WorkAction.FINISHED]: FinishedWork;
  [WorkAction.IN_PROGRESS]: InProgressWork;
  [WorkAction.IGNORE]: IgnoredWork;
}

export const WORK_STATE_TO_ACTION_MAP: {
  [K in WorkState]: WorkAction;
} = {
  [WorkState.FINISHED]: WorkAction.FINISHED,
  [WorkState.IN_PROGRESS]: WorkAction.IN_PROGRESS,
  [WorkState.IGNORED]: WorkAction.IGNORE,
};

export const ACTION_DEFAULTS_MAP: {
  [K in keyof WorkActionTypeMap]: (
    data: Partial<WorkActionTypeMap[K]>,
  ) => Partial<WorkActionTypeMap[K]>;
} = {
  finished: (data) => ({
    finishedAt: data.finishedAt || Date.now(),
  }),
  in_progress: (data) => ({
    startedAt: data.startedAt || Date.now(),
    lastReadAt: data.lastReadAt || Date.now(),
    lastReadChapter:
      data.lastReadChapter || getCurrentChapterFromWorkPage() || 1,
  }),
  ignore: (data) => ({
    ignoredAt: data.ignoredAt || Date.now(),
  }),
};

export interface ActionMessagesEntry {
  success: {
    save: string;
    edit: string;
    delete: string;
  };
  error: {
    save: string;
    edit: string;
    delete: string;
  };
}

export const ACTION_MESSAGES_MAP: {
  [K in keyof WorkActionTypeMap]: ActionMessagesEntry;
} = {
  [WorkAction.FINISHED]: {
    success: {
      save: "You have successfully marked %title% as read.",
      edit: "You have successfully updated finished info for %title%.",
      delete: "You have successfully marked %title% as unread.",
    },
    error: {
      save: "Something went wrong while marking %title% as read.",
      edit: "Something went wrong while updating finished info for %title%.",
      delete: "Something went wrong while marking %title% as unread.",
    },
  },
  [WorkAction.IN_PROGRESS]: {
    success: {
      save: "You have successfully started reading %title%.",
      edit: "You've successfully updated your reading progress for %title%.",
      delete: "You have successfully stopped reading %title%.",
    },
    error: {
      save: "Something went wrong while marking %title% as in progress.",
      edit: "Something went wrong while updating your reading progress for %title%.",
      delete:
        "Something went wrong while deleting %title% from your in progress list.",
    },
  },
  [WorkAction.IGNORE]: {
    success: {
      save: "You have successfully ignored %title%.",
      edit: "You have successfully updated ignore info for %title%.",
      delete: "%title% will no longer be ignored.",
    },
    error: {
      save: "Something went wrong while ignoring %title%.",
      edit: "Something went wrong while updating ignore info for %title%.",
      delete: "Something went wrong while unignoring %title%.",
    },
  },
};
