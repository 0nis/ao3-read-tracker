import { createSettingsSection } from "../../core/setting/base";
import { SettingsSectionItem } from "../../core/setting/types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { text } from "../../../../utils/ui/forms";
import { FormItemType } from "../../../../enums/forms";
import { GeneralSettings } from "../../../../types/settings";

const items: SettingsSectionItem<GeneralSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "AO3 'Mark as Read' Button Text",
    input: text({ placeholder: "e.g., Finished" }),
    dataField: "nativeMarkAsReadReplacementLabel",
    description:
      "Changes the text shown on AO3's built-in 'Mark as Read' button on the work page. This affects AO3's own button - the one that appears after marking the work for later. Leave blank to use AO3's default text.",
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
