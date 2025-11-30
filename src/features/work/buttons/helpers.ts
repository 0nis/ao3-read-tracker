import { ACTION_BUTTON_CONFIG, ACTION_HANDLER_MAP } from "./config";
import { ButtonConfig, ButtonAction } from "./types";
import { createToggleButton } from "./components/toggle-btn";
import { createClickButton } from "./components/click-btn";

import { getIdFromUrl } from "../../../utils/ao3";
import { ButtonPlacement } from "../../../enums/settings";

export function buildButtonConfig<K extends keyof typeof ACTION_BUTTON_CONFIG>(
  key: K,
  simple: boolean
): ButtonConfig {
  const meta = ACTION_BUTTON_CONFIG[key];
  const partial: Partial<ButtonConfig> = { type: key };
  if (simple)
    return {
      ...partial,
      ...meta.simple,
      mode: ButtonAction.TOGGLE,
    } as ButtonConfig;
  else
    return {
      ...partial,
      ...meta.advanced,
      mode: ButtonAction.CLICK,
    } as ButtonConfig;
}

export async function createActionModeButton(
  config: ButtonConfig
): Promise<HTMLAnchorElement | undefined> {
  const WorkId = getIdFromUrl();
  if (!WorkId) return Promise.reject();

  const map = ACTION_HANDLER_MAP[config.type];
  const exists = map?.storage ? (await map.storage.exists(WorkId)).data : false;

  let button: HTMLAnchorElement;
  if (config.mode === ButtonAction.TOGGLE)
    button = createToggleButton(WorkId, config, exists);
  else button = createClickButton(WorkId, config, exists);

  return button;
}

export function getButtonParents(placement: ButtonPlacement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  switch (placement) {
    case ButtonPlacement.BOTTOM || ButtonPlacement.BOTH:
      const feedback = document.getElementById("feedback");
      const bNav = feedback?.querySelector("ul.actions");
      if (feedback && bNav) parents.push(bNav as HTMLElement);
    default:
      const tNav = document.querySelector("ul.work.navigation.actions");
      if (tNav) parents.push(tNav as HTMLElement);
  }
  return parents;
}
