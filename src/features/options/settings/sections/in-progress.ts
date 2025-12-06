import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { select, toggleSwitch } from "../../../../utils/ui/forms";
import { DisplayMode, VerticalPlacement } from "../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";
import { FormItemType } from "../../../../enums/forms";
import { InProgressSettings } from "../../../../types/settings";

const items: SettingsSectionItem<InProgressSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch("read-simple-mode-enabled-toggle"),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
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
        input: select(DisplayMode),
        dataField: "defaultDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Actively Reading",
        input: select(DisplayMode),
        dataField: "activeDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Waiting to Read",
        input: select(DisplayMode),
        dataField: "waitingDisplayMode",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.IN_PROGRESS_SETTINGS,
        label: "Paused Reading",
        input: select(DisplayMode),
        dataField: "pausedDisplayMode",
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "Symbol Display Mode",
    input: select(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means read or in progress, 'status' means finished, abandoned, paused, etc.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IN_PROGRESS_SETTINGS,
    label: "'Update' Button Placement",
    input: select(VerticalPlacement),
    dataField: "updateButtonPlacement",
    description:
      "Whether the 'update read progress' button appears at the top or the bottom of the work page.",
  },
];

export async function buildInProgressSettingsSection(): Promise<HTMLElement> {
  const { inProgressSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.IN_PROGRESS_SETTINGS,
    title: "In Progress Settings",
    data: inProgressSettings,
    items,
  });
}
