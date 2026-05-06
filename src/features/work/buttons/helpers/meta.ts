import { ACTION_LABELS } from "../config";
import { handleDeleteWork } from "../handlers/delete";
import { handleEditWork } from "../handlers/edit";
import { handleSaveWork } from "../handlers/save";
import { ButtonAction, ActionButtonMeta, ActionLabelSet } from "../types";

import { WORK_ACTION_MODULE_MAP, WorkAction } from "../../config";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { ModuleStates } from "../../../../types/settings";

let _cache: Record<WorkAction, ActionButtonMeta> | null = null;

export function buildActionButtonConfig(
  modules: ModuleStates,
): Record<WorkAction, ActionButtonMeta> {
  if (_cache) return _cache;

  _cache = Object.fromEntries(
    Object.entries(ACTION_LABELS)
      .filter(
        ([key]) => modules[WORK_ACTION_MODULE_MAP[key as WorkAction]].enabled,
      )
      .map(([key, labels]) => [key, makeMeta(key as WorkAction, labels)]),
  ) as Record<WorkAction, ActionButtonMeta>;
  return _cache as Record<WorkAction, ActionButtonMeta>;
}

function makeMeta(
  action: WorkAction,
  labels: ActionLabelSet,
): ActionButtonMeta {
  return {
    simple: {
      type: action,
      mode: ButtonAction.TOGGLE,
      labels: labels.simple,
      onActivate: (id, btn) => handleSaveWork(id, action, btn),
      onDeactivate: (id, btn) => handleDeleteWork(id, action, btn),
    },
    advanced: {
      type: action,
      mode: ButtonAction.CLICK,
      labels: labels.advanced,
      href: `#${CLASS_PREFIX}__${action}-form`,
      onClick: (id, btn) => handleEditWork(id, action, btn),
    },
  };
}
