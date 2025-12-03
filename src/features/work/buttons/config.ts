import { ActionHandlerEntry, ActionLabelSet } from "./types";
import { WorkAction, WorkActionTypeMap } from "../config";

import { createIgnoreWorkForm } from "../forms/instances/ignore";
import { createReadWorkForm } from "../forms/instances/read";

import { StorageService } from "../../../services/storage";
import {
  IgnoreSettings,
  ReadSettings,
  SettingsData,
} from "../../../types/settings";
import { createInProgressWorkForm } from "../forms/instances/in-progress";

export const ACTION_LABELS: {
  [K in keyof WorkActionTypeMap]: ActionLabelSet;
} = {
  [WorkAction.READ]: {
    simple: {
      off: "Mark as Read",
      on: "Mark as Unread",
    },
    advanced: {
      off: "Mark as Read",
      on: "Edit Read Info",
    },
  },
  [WorkAction.IN_PROGRESS]: {
    simple: {
      off: "Start Reading",
      on: "Stop Reading",
    },
    advanced: {
      off: "Start Reading",
      on: "Edit In Progress Info",
    },
  },
  [WorkAction.IGNORE]: {
    simple: {
      off: "Ignore",
      on: "Unignore",
    },
    advanced: {
      off: "Ignore",
      on: "Edit Ignore Info",
    },
  },
} as const;

export const ACTION_HANDLER_MAP: {
  [K in keyof WorkActionTypeMap]: ActionHandlerEntry<WorkActionTypeMap[K]>;
} = {
  [WorkAction.READ]: {
    storage: StorageService.readWorks,
    createForm: (data, editing, origin) =>
      createReadWorkForm(data, editing, origin),
  },
  [WorkAction.IN_PROGRESS]: {
    storage: StorageService.inProgressWorks,
    createForm: (data, editing, origin) =>
      createInProgressWorkForm(data, editing, origin),
  },
  [WorkAction.IGNORE]: {
    storage: StorageService.ignoredWorks,
    createForm: (data, editing, origin) =>
      createIgnoreWorkForm(data, editing, origin),
  },
};

export interface WorkActionSettingsMap {
  [WorkAction.READ]: ReadSettings;
  [WorkAction.IN_PROGRESS]: ReadSettings; // TODO: Change to InProgressSettings when created
  [WorkAction.IGNORE]: IgnoreSettings;
}

export const ACTION_SETTINGS_MAP: {
  [K in keyof WorkActionSettingsMap]: (
    s: SettingsData
  ) => WorkActionSettingsMap[K];
} = {
  [WorkAction.READ]: (s) => s.readSettings,
  [WorkAction.IN_PROGRESS]: (s) => s.readSettings, // TODO: Change to inProgressSettings when created
  [WorkAction.IGNORE]: (s) => s.ignoreSettings,
};
