import { createSettingsSection } from "../../../core/setting/base";
import { SettingsSectionItem } from "../../../core/setting/types";
import { SectionId } from "../../../config";

import { settingsCache } from "../../../../../services/cache";
import { enumSelect, toggleSwitch } from "../../../../../ui/forms";
import { DisplayMode, VerticalPlacement } from "../../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../../enums/symbols";
import { FormItemType } from "../../../../../ui/forms/enums";
import { FinishedSettings } from "../../../../../types/settings";

const items: SettingsSectionItem<FinishedSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.FINISHED_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch(),
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
        input: enumSelect(DisplayMode),
        dataField: "defaultDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Reread Worthy",
        input: enumSelect(DisplayMode),
        dataField: "rereadWorthyDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Completed",
        input: enumSelect(DisplayMode),
        dataField: "completedDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Dropped",
        input: enumSelect(DisplayMode),
        dataField: "droppedDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.FINISHED_SETTINGS,
        label: "Dormant",
        input: enumSelect(DisplayMode),
        dataField: "dormantDisplayMode",
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.FINISHED_SETTINGS,
    label: "Symbol Display Mode",
    input: enumSelect(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means finished or in progress, 'status' means completed, dropped, paused, etc.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Button Placement",
    input: enumSelect(VerticalPlacement),
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' button appears on work pages.",
  },
];

export async function buildFinishedSettingsSection(): Promise<HTMLElement> {
  const { finishedSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.FINISHED_SETTINGS,
    title: "Finished works Settings",
    data: finishedSettings,
    items,
  });
}
