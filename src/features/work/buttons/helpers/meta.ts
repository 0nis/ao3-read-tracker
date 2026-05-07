import { handleDeleteWork } from "../handlers/delete";
import { handleEditWork } from "../handlers/edit";
import { handleSaveWork } from "../handlers/save";

import { ButtonAction, ActionButtonMeta, ActionLabelSet } from "../types";
import { WORK_STATE_TO_ACTION_MAP, WorkAction } from "../../config";

import { LabelSettings, ModuleStates } from "../../../../types/settings";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { WORK_STATE_MODULE_MAP, WorkState } from "../../../../enums/works";

let _cache: Record<WorkAction, ActionButtonMeta> | null = null;

export function buildActionButtonConfig(
  modules: ModuleStates,
  labels: LabelSettings,
): Record<WorkAction, ActionButtonMeta> {
  if (_cache) return _cache;

  _cache = Object.fromEntries(
    Object.entries(labels.actions)
      .filter(
        ([key]) => modules[WORK_STATE_MODULE_MAP[key as WorkState]].enabled,
      )
      .map(([key, labels]) => [
        WORK_STATE_TO_ACTION_MAP[key as WorkState],
        makeMeta(WORK_STATE_TO_ACTION_MAP[key as WorkState], labels),
      ]),
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
