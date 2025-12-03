import { IgnoredWork, InProgressWork, ReadWork } from "../../types/works";

export enum WorkAction {
  READ = `read`,
  IN_PROGRESS = `in_progress`,
  IGNORE = `ignore`,
}

export enum WorkActionState {
  MARKED = "marked",
  UNMARKED = "unmarked",
}

export interface WorkActionTypeMap {
  [WorkAction.READ]: ReadWork;
  [WorkAction.IN_PROGRESS]: InProgressWork;
  [WorkAction.IGNORE]: IgnoredWork;
}

export const ACTION_DEFAULTS_MAP: {
  [K in keyof WorkActionTypeMap]: (
    data: Partial<WorkActionTypeMap[K]>
  ) => Partial<WorkActionTypeMap[K]>;
} = {
  read: (data) => ({
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
  }),
  in_progress: (data) => ({
    lastReadAt: data.lastReadAt || Date.now(),
  }),
  ignore: (data) => ({
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
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
  [WorkAction.READ]: {
    success: {
      save: "You have successfully marked %title% as read.",
      edit: "You have successfully updated read info for %title%.",
      delete: "You have successfully marked %title% as unread.",
    },
    error: {
      save: "Something went wrong while marking %title% as read.",
      edit: "Something went wrong while updating read info for %title%.",
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
