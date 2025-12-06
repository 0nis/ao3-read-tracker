import { getStyles } from "./style";
import { SettingsSectionConfig } from "./types";
import { SettingsSectionTypeMap } from "./config";
import { saveSettingsData } from "./helpers/save";
import { createSettingsSectionContent } from "./components/items";
import { createSettingsSectionSaveButton } from "./components/submit";

import { PREFIX } from "..";
import { createSection } from "../components/section";

import { settingsCache } from "../../../services/cache";
import { el, injectStyles } from "../../../utils/ui/dom";
import { populateFormValues } from "../../../utils/ui/forms";

export function createSettingsSection<K extends keyof SettingsSectionTypeMap>(
  cfg: SettingsSectionConfig<SettingsSectionTypeMap[K]> & { id: K }
): HTMLElement {
  injectStyles(`${PREFIX}__styles--settings-section`, getStyles(PREFIX));

  const section = createSection(cfg);
  section.appendChild(createSettingsSectionContent(cfg.items));

  const saveEl = createSettingsSectionSaveButton(cfg.title);
  saveEl.addEventListener("click", async (e) => {
    e.preventDefault();
    // TODO: Either show the notification below the save button or scroll to the top to show it
    await saveSettingsData(cfg, saveEl);
    settingsCache.clear();
  });

  const actions = el(
    "div",
    { className: `actions ${PREFIX}__settings__actions` },
    [saveEl]
  );
  section.appendChild(actions);

  populateFormValues(cfg.items, cfg.data);

  return section;
}
