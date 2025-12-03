import { WorkAction } from "../config";
import { ACTION_SETTINGS_MAP } from "./config";
import {
  buildActionButtonConfig,
  createActionModeButton,
  getButtonParents,
  getWorkNavBars,
  insertButtonIntoParent,
} from "./helpers";

import { settingsCache } from "../../../services/cache/settings";
import { SettingsData } from "../../../types/settings";
import { warn } from "../../../utils/extension/console";

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
  const navs = getWorkNavBars();
  if (!navs.top && !navs.bottom) return;

  const cfg = buildActionButtonConfig();

  const { generalSettings } = settings;
  for (const a of Object.keys(cfg) as WorkAction[]) {
    const s = ACTION_SETTINGS_MAP[a]?.(settings);
    if (!s) {
      warn(`No settings found for action button: ${a}`);
      continue;
    }
    const parents = getButtonParents(generalSettings.buttonPlacement, navs);
    for (const p of parents) {
      const btn = await createActionModeButton(
        s.simpleModeEnabled ? cfg[a].simple : cfg[a].advanced
      );
      if (!btn) continue;
      insertButtonIntoParent(p, btn);
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
