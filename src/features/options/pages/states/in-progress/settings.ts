import { createSettingsSection } from "../../../core/setting/base";
import { SettingsSectionItem } from "../../../core/setting/types";
import { SectionId } from "../../../config";

import { settingsCache } from "../../../../../services/cache";
import { enumSelect, toggleSwitch } from "../../../../../ui/forms";
import { DisplayMode, VerticalPlacement } from "../../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../../enums/symbols";
import { FormItemType } from "../../../../../ui/forms/enums";
import { InProgressSettings } from "../../../../../types/settings";

const items: SettingsSectionItem<InProgressSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch(),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the extension will not ask you for additional information like notes. It will immediately mark the work as in progress.",
  },
  {
    type: FormItemType.GROUP,
    id: "displayModes",
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Display Modes",
    description:
      "Settings related to how the work listings appear after marking them as in progress.",
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Default",
        input: enumSelect(DisplayMode),
        dataField: "displayModes.default",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Actively Reading",
        input: enumSelect(DisplayMode),
        dataField: "displayModes.statusActive",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Waiting to Read",
        input: enumSelect(DisplayMode),
        dataField: "displayModes.statusWaiting",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Paused Reading",
        input: enumSelect(DisplayMode),
        dataField: "displayModes.statusPaused",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "New Chapters Available",
        input: enumSelect(DisplayMode),
        dataField: "displayModes.newChaptersAvailable",
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Symbol Display Mode",
    input: enumSelect(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means finished or in progress, 'status' means completed, dropped, paused, etc.",
  },
  {
    type: FormItemType.GROUP,
    id: "buttonPlacements",
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Button Placement",
    description: "Choose where the In Progress buttons appear on work pages.",
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Start Reading Button",
        input: enumSelect(VerticalPlacement),
        dataField: "buttonPlacement",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Update Read Progress Button",
        input: enumSelect(VerticalPlacement),
        dataField: "updateButtonPlacement",
      },
    ],
  },
];

export async function buildInProgressSettingsSection(): Promise<HTMLElement> {
  const { inProgressSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.IN_PROGRESS_SETTINGS,
    title: "In Progress Works Settings",
    data: inProgressSettings,
    items,
  });
}
