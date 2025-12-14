import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { enumSelect, text, toggleSwitch } from "../../../../utils/ui/forms";
import { VerticalPlacement } from "../../../../enums/settings";
import { FormItemType } from "../../../../enums/forms";
import { GeneralSettings } from "../../../../types/settings";

const items: SettingsSectionItem<GeneralSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Hide Symbols",
    input: toggleSwitch(),
    dataField: "hideSymbols",
    description:
      "Whether to hide all symbols next to the title of the works in lists.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Button Placement",
    input: enumSelect(VerticalPlacement),
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Replace 'Mark as Read' Button Label?",
    input: toggleSwitch(),
    dataField: "replaceMarkForLaterLabel",
    description:
      "Whether to replace the text within AO3's default 'Mark as Read' button (the one that appears when you mark a work for later, not the one the extension adds) with custom text.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "'Mark as Read' Custom Label",
    input: text("e.g., Finished"),
    dataField: "markForLaterReplacementLabel",
    description:
      "The custom label to use for AO3's default 'Mark as Read' button, if you have chosen to replace it above.",
  },
];

export async function buildGeneralSettingsSection(): Promise<HTMLElement> {
  const { generalSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.GENERAL_SETTINGS,
    title: "General Settings",
    data: generalSettings,
    items,
  });
}
