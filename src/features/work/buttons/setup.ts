import { ACTION_SETTINGS_MAP } from "./config";
import { handleCheckExistence } from "./handlers/existence";
import { handleUpdateInProgressInfo } from "./handlers/update";
import {
  createActionModeButton,
  handleOnUpdateReadProgressEvent,
} from "./helpers/create";
import { buildActionButtonConfig } from "./helpers/meta";
import { ButtonNavs, getWorkNavBars, placeButtons } from "./helpers/placement";
import { createUpdateButton } from "./components/update";
import { WorkAction } from "../config";

import { settingsCache } from "../../../services/cache";
import { warn } from "../../../shared/extension/logger";
import { getIdFromUrl } from "../../../shared/ao3";
import { SettingsData } from "../../../types/settings";
import { VerticalPlacement } from "../../../enums/settings";

export async function setupButtons() {
  const settings = await settingsCache.get();

  modifyMarkForLaterButton(
    settings.labelSettings?.misc.nativeMarkAsReadReplacement,
  );

  const workId = getIdFromUrl();
  const navs = getWorkNavBars();
  if (!navs.top && !navs.bottom) return;

  await setupAllActionButtons(settings, navs);
  if (settings.generalSettings.modules.inProgressModule.enabled) {
    await setupUpdateReadProgressButton({
      workId,
      navs,
      label: settings.labelSettings.actions.in_progress.updateReadProgress,
      placement: settings.inProgressSettings.updateButtonPlacement,
    });
  }
}

async function setupAllActionButtons(settings: SettingsData, navs: ButtonNavs) {
  const cfg = buildActionButtonConfig(
    settings.generalSettings.modules,
    settings.labelSettings,
  );

  for (const action of Object.keys(cfg) as WorkAction[]) {
    const s = ACTION_SETTINGS_MAP[action]?.(settings);
    if (!s) {
      warn(`No settings found for action button: ${action}`);
      continue;
    }

    await placeButtons(
      s.buttonPlacement,
      navs,
      async () =>
        await createActionModeButton(
          s.simpleModeEnabled ? cfg[action].simple : cfg[action].advanced,
        ),
    );
  }
}

async function setupUpdateReadProgressButton({
  workId,
  label,
  navs,
  placement,
}: {
  workId: string | null;
  label: string;
  navs: ButtonNavs;
  placement: VerticalPlacement;
}) {
  if (!workId) return;
  const exists = await handleCheckExistence(workId, WorkAction.IN_PROGRESS);
  await placeButtons(placement, navs, () =>
    createUpdateButton(
      label,
      handleUpdateInProgressInfo,
      handleOnUpdateReadProgressEvent,
      exists ? false : true,
    ),
  );
}

function modifyMarkForLaterButton(label: string) {
  if (!label) return;
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  const button = nav.querySelector<HTMLButtonElement>("li.mark button");
  if (!button || button.textContent !== "Mark as Read") return;
  button.textContent = label;
}
