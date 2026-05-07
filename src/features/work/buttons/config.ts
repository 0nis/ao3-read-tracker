import { ActionHandlerEntry, ActionLabelSet } from "./types";
import { WorkAction, WorkActionTypeMap } from "../config";

import { createIgnoreWorkForm } from "../forms/instances/ignore";
import { createFinishedWorkForm } from "../forms/instances/finished";
import { createInProgressWorkForm } from "../forms/instances/inProgress";

import { StorageService } from "../../../services/storage/storage";
import {
  IgnoreSettings,
  InProgressSettings,
  FinishedSettings,
  SettingsData,
} from "../../../types/settings";

export const ACTION_HANDLER_MAP: {
  [K in keyof WorkActionTypeMap]: ActionHandlerEntry<WorkActionTypeMap[K]>;
} = {
  [WorkAction.FINISHED]: {
    storage: StorageService.finishedWorks,
    createForm: async (data, editing, origin) =>
      await createFinishedWorkForm(data, editing, origin),
  },
  [WorkAction.IN_PROGRESS]: {
    storage: StorageService.inProgressWorks,
    createForm: async (data, editing, origin) =>
      await createInProgressWorkForm(data, editing, origin),
  },
  [WorkAction.IGNORE]: {
    storage: StorageService.ignoredWorks,
    createForm: async (data, editing, origin) =>
      await createIgnoreWorkForm(data, editing, origin),
  },
};

export interface WorkActionSettingsMap {
  [WorkAction.FINISHED]: FinishedSettings;
  [WorkAction.IN_PROGRESS]: InProgressSettings;
  [WorkAction.IGNORE]: IgnoreSettings;
}

export const ACTION_SETTINGS_MAP: {
  [K in keyof WorkActionSettingsMap]: (
    s: SettingsData,
  ) => WorkActionSettingsMap[K];
} = {
  [WorkAction.FINISHED]: (s) => s.finishedSettings,
  [WorkAction.IN_PROGRESS]: (s) => s.inProgressSettings,
  [WorkAction.IGNORE]: (s) => s.ignoreSettings,
};
