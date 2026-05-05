import { createSettingsSection } from "../../../core/setting/base";
import { SettingsSectionItem } from "../../../core/setting/types";
import { SectionId } from "../../../config";

import { settingsCache } from "../../../../../services/cache";
import { enumSelect, toggleSwitch } from "../../../../../ui/forms";
import { FormItemType } from "../../../../../ui/forms/enums";
import { DisplayMode, VerticalPlacement } from "../../../../../enums/settings";
import { IgnoreSettings } from "../../../../../types/settings";

const items: SettingsSectionItem<IgnoreSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IGNORE_SETTINGS,
    label: "Enable Simple Mode",
    input: toggleSwitch(),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the ignore feature will not ask you for a reason first. It will simply mark the work as ignored immediately.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.IGNORE_SETTINGS,
    label: "Default Display Mode",
    input: enumSelect(DisplayMode),
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've ignored said work. For example, 'collapse aggressive' will hide all details",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Button Placement",
    input: enumSelect(VerticalPlacement),
    dataField: "buttonPlacement",
    description: "Choose where the 'Ignore' button appears on work pages.",
  },
];

export async function buildIgnoreSettingsSection(): Promise<HTMLElement> {
  const { ignoreSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.IGNORE_SETTINGS,
    title: "Ignored Works Settings",
    data: ignoreSettings,
    items,
  });
}
