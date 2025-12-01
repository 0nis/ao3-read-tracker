import { ACTION_BUTTON_CONFIG, ACTION_HANDLER_MAP } from "./config";
import { ButtonConfig, ButtonAction } from "./types";
import { createToggleButton } from "./components/toggle-btn";
import { createClickButton } from "./components/click-btn";

import { getIdFromUrl } from "../../../utils/ao3";
import { ButtonPlacement } from "../../../enums/settings";
import { warn } from "../../../utils/extension/console";

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
  const workId = getIdFromUrl();
  if (!workId) return;

  const map = ACTION_HANDLER_MAP[config.type];
  const exists = map?.storage ? (await map.storage.exists(workId)).data : false;

  let button: HTMLAnchorElement;
  if (config.mode === ButtonAction.TOGGLE)
    button = createToggleButton(workId, config, exists);
  else button = createClickButton(workId, config, exists);

  return button;
}

export function getButtonParents(
  placement: ButtonPlacement,
  nav: {
    top: HTMLElement | null;
    bottom: HTMLElement | null;
  }
): HTMLElement[] {
  const parents: HTMLElement[] = [];
  switch (placement) {
    case ButtonPlacement.BOTTOM || ButtonPlacement.BOTH:
      if (nav.bottom) parents.push(nav.bottom as HTMLElement);
    default:
      if (nav.top) parents.push(nav.top as HTMLElement);
  }
  return parents;
}

export function getWorkNavBars(): {
  top: HTMLElement | null;
  bottom: HTMLElement | null;
} {
  const feedback = document.getElementById("feedback");
  const bNav = feedback?.querySelector("ul.actions");
  const tNav = document.querySelector("ul.work.navigation.actions");
  if (!tNav) warn("Top work navigation bar not found.");
  if (!bNav) warn("Bottom work navigation bar not found.");
  return {
    top: tNav as HTMLElement | null,
    bottom: bNav as HTMLElement | null,
  };
}
