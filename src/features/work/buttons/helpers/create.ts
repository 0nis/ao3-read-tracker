import { ACTION_HANDLER_MAP } from "../config";
import { ButtonConfig, ButtonAction } from "../types";
import { createToggleButton } from "../components/toggle";
import { createOpenFormButton } from "../components/open-form";
import { WorkAction, WorkActionEvent } from "../../config";

import { getIdFromUrl } from "../../../../shared/ao3";
import { CLASS_PREFIX } from "../../../../constants/classes";

export async function createActionModeButton(
  config: ButtonConfig,
): Promise<HTMLElement | undefined> {
  const workId = getIdFromUrl();
  if (!workId) return;

  const map = ACTION_HANDLER_MAP[config.type];
  const exists = map?.storage ? (await map.storage.exists(workId)).data : false;

  let button: HTMLElement;
  if (config.mode === ButtonAction.TOGGLE)
    button = createToggleButton(workId, config, exists);
  else button = createOpenFormButton(workId, config, exists);

  return button;
}

export async function handleOnUpdateReadProgressEvent(
  button: HTMLElement,
  workAction: WorkAction,
  workActionEvent: WorkActionEvent,
) {
  if (workAction === WorkAction.IN_PROGRESS) {
    if (workActionEvent === WorkActionEvent.DELETE) {
      button.classList.add(`${CLASS_PREFIX}__hidden`);
      button.setAttribute("aria-hidden", "true");
    } else if (workActionEvent === WorkActionEvent.SAVE) {
      button.classList.remove(`${CLASS_PREFIX}__hidden`);
      button.removeAttribute("aria-hidden");
    }
  }
}
