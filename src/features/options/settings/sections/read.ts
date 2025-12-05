import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { select, toggleSwitch } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";
import { FormItemType } from "../../../../enums/forms";
import { ReadSettings } from "../../../../types/settings";

const items: SettingsSectionItem<ReadSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.READ_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch("read-simple-mode-enabled-toggle"),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  },
  {
    type: FormItemType.GROUP,
    id: "displayModes",
    sectionId: SectionId.READ_SETTINGS,
    label: "Display Modes",
    description:
      "Settings related to how the work listings appear after marking them as read.",
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.READ_SETTINGS,
        label: "Default",
        input: select(DisplayMode),
        dataField: "defaultDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.READ_SETTINGS,
        label: "Reread worthy",
        input: select(DisplayMode),
        dataField: "rereadWorthyDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.READ_SETTINGS,
        label: "Completed",
        input: select(DisplayMode),
        dataField: "completedDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.READ_SETTINGS,
        label: "Abandoned",
        input: select(DisplayMode),
        dataField: "abandonedDisplayMode",
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.READ_SETTINGS,
    label: "Symbol Display Mode",
    input: select(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means read or in progress, 'status' means finished, abandoned, paused, etc.",
  },
];

export async function buildReadSettingsSection(): Promise<HTMLElement> {
  const { readSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.READ_SETTINGS,
    title: "Read Settings",
    data: readSettings,
    items,
  });
}
