import { WorkAction } from "../config";
import { ACTION_SETTINGS_MAP } from "./config";
import { handleCheckExistence, handleUpdateInProgressInfo } from "./handlers";
import {
  buildActionButtonConfig,
  createActionModeButton,
  getButtonParents,
  getWorkNavBars,
  handleOnUpdateReadProgress,
  insertButtonIntoParent,
} from "./helpers";
import { createUpdateButton } from "./components/update";

import { settingsCache } from "../../../services/cache";
import { warn } from "../../../utils/extension";
import { getIdFromUrl } from "../../../utils/ao3";
import { SettingsData } from "../../../types/settings";
import { VerticalPlacement } from "../../../enums/settings";

export async function setupButtons() {
  const settings = await settingsCache.get();

  if (settings.generalSettings?.replaceMarkForLaterText) {
    modifyMarkForLaterButton(
      settings.generalSettings?.markForLaterReplacementLabel
    );
  }

  const workId = getIdFromUrl();

  await setupAllActionButtons(settings);
  await setupUpdateReadProgressButton(workId, settings);
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

async function setupUpdateReadProgressButton(
  workId: string | null,
  settings: SettingsData
) {
  if (!workId) return;
  const exists = await handleCheckExistence(workId, WorkAction.IN_PROGRESS);
  const navs = getWorkNavBars();
  if (!navs.bottom) return;
  // TODO: Make label configurable, make placement configurable
  const btn = createUpdateButton(
    "Update Read Progress",
    handleUpdateInProgressInfo,
    handleOnUpdateReadProgress,
    exists ? false : true,
    { "data-origin": VerticalPlacement.BOTTOM }
  );
  insertButtonIntoParent(navs.bottom, btn);
}

function modifyMarkForLaterButton(label: string) {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  const button = nav.querySelector<HTMLButtonElement>("li.mark button");
  if (!button || button.textContent !== "Mark as Read") return;
  button.textContent = label;
}
