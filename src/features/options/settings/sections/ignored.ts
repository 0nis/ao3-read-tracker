import { createSettingsSection } from "../base";
import { SettingsSectionItem } from "../types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { enumSelect, toggleSwitch } from "../../../../utils/ui/forms";
import { FormItemType } from "../../../../enums/forms";
import { DisplayMode } from "../../../../enums/settings";
import { IgnoreSettings } from "../../../../types/settings";

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
