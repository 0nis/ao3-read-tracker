import { handleDeleteWork, handleEditWork, handleSaveWork } from "./handlers";
import { ActionButtonMeta, ActionHandlerEntry, ButtonAction } from "./types";

import { WorkAction, WorkActionTypeMap } from "../config";
import { createIgnoreWorkForm } from "../forms/instances/ignore";
import { createReadWorkForm } from "../forms/instances/read";

import { CLASS_PREFIX } from "../../../constants/classes";
import { StorageService } from "../../../services/storage";
import {
  IgnoreSettings,
  ReadSettings,
  SettingsData,
} from "../../../types/settings";

export const ACTION_BUTTON_CONFIG: {
  [K in keyof WorkActionTypeMap]: ActionButtonMeta;
} = {
  [WorkAction.READ]: {
    simple: {
      labels: {
        off: "Mark as Read",
        on: "Mark as Unread",
      },
      onActivate: (id: string) => handleSaveWork(id, WorkAction.READ),
      onDeactivate: (id: string) => handleDeleteWork(id, WorkAction.READ),
    },
    advanced: {
      type: WorkAction.READ,
      mode: ButtonAction.CLICK,
      labels: {
        off: "Mark as Read",
        on: "Edit Read Info",
      },
      href: `#${CLASS_PREFIX}__${WorkAction.READ}-form`,
      onClick: (id: string) => handleEditWork(id, WorkAction.READ),
    },
  },
  [WorkAction.IGNORE]: {
    simple: {
      type: WorkAction.IGNORE,
      mode: ButtonAction.TOGGLE,
      labels: {
        off: "Ignore",
        on: "Unignore",
      },
      onActivate: (id: string) => handleSaveWork(id, WorkAction.IGNORE),
      onDeactivate: (id: string) => handleDeleteWork(id, WorkAction.IGNORE),
    },
    advanced: {
      type: WorkAction.IGNORE,
      mode: ButtonAction.CLICK,
      labels: {
        off: "Ignore",
        on: "Edit Ignore Info",
      },
      href: `#${CLASS_PREFIX}__${WorkAction.IGNORE}-form`,
      onClick: (id: string) => handleEditWork(id, WorkAction.IGNORE),
    },
  },
};

export const ACTION_HANDLER_MAP: {
  [K in keyof WorkActionTypeMap]: ActionHandlerEntry<WorkActionTypeMap[K]>;
} = {
  [WorkAction.READ]: {
    storage: StorageService.readWorks,
    createForm: (data, editing) => createReadWorkForm(data, editing),
  },

  [WorkAction.IGNORE]: {
    storage: StorageService.ignoredWorks,
    createForm: (data, editing) => createIgnoreWorkForm(data, editing),
  },
};

export interface WorkActionSettingsMap {
  [WorkAction.READ]: ReadSettings;
  [WorkAction.IGNORE]: IgnoreSettings;
}

export const ACTION_SETTINGS_MAP: {
  [K in keyof WorkActionSettingsMap]: (
    s: SettingsData
  ) => WorkActionSettingsMap[K];
} = {
  [WorkAction.READ]: (s) => s.readSettings,
  [WorkAction.IGNORE]: (s) => s.ignoreSettings,
};
