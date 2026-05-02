import { getStyles } from "./style";
import { SettingsSectionConfig } from "./types";
import { SettingsSectionTypeMap } from "./config";
import { saveSettingsData } from "./handlers/save";
import { createSettingsSectionContent } from "./components/items";
import { createSettingsSectionSaveButton } from "./components/submit";
import { createSectionWrapper } from "../components/section/component";

import { settingsCache } from "../../../../services/cache";
import { setButtonOrigin } from "../../../../shared/attributes";
import { el, injectStyles } from "../../../../utils/dom";
import { populateFormValues } from "../../../../utils/ui/forms";
import { VerticalPlacement } from "../../../../enums/settings";
import { CLASS_PREFIX } from "../../../../constants/classes";

export const SETTINGS_CLASS = `${CLASS_PREFIX}__settings`;

export function createSettingsSection<K extends keyof SettingsSectionTypeMap>(
  cfg: SettingsSectionConfig<SettingsSectionTypeMap[K]> & { id: K },
): HTMLElement {
  injectStyles(
    `${CLASS_PREFIX}__styles--settings-section`,
    getStyles(SETTINGS_CLASS),
  );

  const saveBtnPlacement = cfg.saveButtonPlacement ?? VerticalPlacement.BOTH;

  const section = createSectionWrapper({
    ...cfg,
    headerChildren:
      saveBtnPlacement === VerticalPlacement.TOP ||
      saveBtnPlacement === VerticalPlacement.BOTH
        ? [
            createActionsElement({
              cfg,
              pos: VerticalPlacement.TOP,
              className: "actions-top",
            }),
          ]
        : [],
  });

  section.appendChild(createSettingsSectionContent(cfg.items));

  if (
    saveBtnPlacement === VerticalPlacement.BOTTOM ||
    saveBtnPlacement === VerticalPlacement.BOTH
  )
    section.appendChild(
      createActionsElement({
        cfg,
        pos: VerticalPlacement.BOTTOM,
        className: "actions-bottom",
      }),
    );

  populateFormValues(cfg.items, cfg.data);

  return section;
}

function createActionsElement<K extends keyof SettingsSectionTypeMap>({
  cfg,
  pos,
  className,
}: {
  cfg: SettingsSectionConfig<SettingsSectionTypeMap[K]> & { id: K };
  pos: VerticalPlacement;
  className: string;
}): HTMLElement {
  const saveEl = createSettingsSectionSaveButton(cfg.title);
  setButtonOrigin(saveEl, pos);
  saveEl.addEventListener("click", async (e) => {
    e.preventDefault();
    await saveSettingsData({
      cfg,
      btn: saveEl,
    });
    window.scrollTo(0, 0);
    settingsCache.clear();
  });

  const actions = el(
    "div",
    { className: `actions ${SETTINGS_CLASS}__${className}` },
    [saveEl],
  );

  return actions;
}
