import { IgnoredWork, ReadWork } from "../../types/works";

export enum WorkAction {
  READ = `read`,
  IGNORE = `ignore`,
}

export enum WorkActionState {
  MARKED = "marked",
  UNMARKED = "unmarked",
}

export interface WorkActionTypeMap {
  [WorkAction.READ]: ReadWork;
  [WorkAction.IGNORE]: IgnoredWork;
}

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
