import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { select, toggleSwitch } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";
import { FormItemType } from "../../../../enums/forms";
import { FinishedSettings } from "../../../../types/settings";

const items: SettingsSectionItem<FinishedSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.FINISHED_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch("finished-simple-mode-enabled-toggle"),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the extension will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  },
  {
    type: FormItemType.GROUP,
    id: "displayModes",
    sectionId: SectionId.FINISHED_SETTINGS,
    label: "Display Modes",
    description:
      "Settings related to how the work listings appear after marking them as read.",
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Default",
        input: select(DisplayMode),
        dataField: "defaultDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Reread Worthy",
        input: select(DisplayMode),
        dataField: "rereadWorthyDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Completed",
        input: select(DisplayMode),
        dataField: "completedDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Abandoned",
        input: select(DisplayMode),
        dataField: "abandonedDisplayMode",
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.FINISHED_SETTINGS,
    label: "Symbol Display Mode",
    input: select(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means finished or in progress, 'status' means finished, abandoned, paused, etc.",
  },
];

export async function buildReadSettingsSection(): Promise<HTMLElement> {
  const { finishedSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.FINISHED_SETTINGS,
    title: "Finished works Settings",
    data: finishedSettings,
    items,
  });
}
