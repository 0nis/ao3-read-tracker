import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { select, text, toggleSwitch } from "../../../../utils/ui/forms";
import { VerticalPlacement } from "../../../../enums/settings";
import { FormItemType } from "../../../../enums/forms";
import { GeneralSettings } from "../../../../types/settings";

const items: SettingsSectionItem<GeneralSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Hide symbols",
    input: toggleSwitch("hide-symbols-toggle"),
    dataField: "hideSymbols",
    description:
      "Whether to hide all symbols next to the title of the works in lists.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Button placement",
    input: select(VerticalPlacement),
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Replace 'Mark as Read' button text?",
    input: toggleSwitch("replace-mark-for-later-text-toggle"),
    dataField: "replaceMarkForLaterText",
    description:
      "Whether to replace AO3's default 'Mark as Read' button (the one that appears when you mark a work for later) with custom text.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Custom label for 'Mark as Read' button",
    input: text("e.g., Finished"),
    dataField: "markForLaterReplacementLabel",
    description:
      "The custom label to use for the 'Mark as Read' button if you have chosen to replace it.",
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
