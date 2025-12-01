import { WorkAction } from "../config";
import { ACTION_BUTTON_CONFIG, ACTION_SETTINGS_MAP } from "./config";
import {
  buildButtonConfig,
  createActionModeButton,
  getButtonParents,
} from "./helpers";

import { settingsCache } from "../../../services/cache/settings";
import { el } from "../../../utils/ui/dom";
import { SettingsData } from "../../../types/settings";

export async function setupButtons() {
  const settings = await settingsCache.get();

  if (settings.generalSettings?.replaceMarkForLaterText) {
    modifyMarkForLaterButton(
      settings.generalSettings?.markForLaterReplacementLabel
    );
  }

  await setupAllActionButtons(settings);
}

async function setupAllActionButtons(settings: SettingsData) {
  for (const a of Object.keys(ACTION_BUTTON_CONFIG) as WorkAction[]) {
    const s = ACTION_SETTINGS_MAP[a]?.(settings);
    const cfg = buildButtonConfig(a, s.simpleModeEnabled);
    const btn = await createActionModeButton(cfg);
    if (!btn) continue;
    const parents = getButtonParents(settings.generalSettings.buttonPlacement);
    for (const parent of parents) {
      parent.appendChild(el("li", {}, btn));
    }
  }
}

function modifyMarkForLaterButton(label: string) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  const button = nav.querySelector<HTMLButtonElement>("li.mark button");
  if (!button || button.textContent !== "Mark as Read") return;
  button.textContent = label;
}
