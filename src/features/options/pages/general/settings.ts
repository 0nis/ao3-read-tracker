import { createSettingsSection } from "../../core/setting/base";
import { SettingsSectionItem } from "../../core/setting/types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { text, toggleSwitch } from "../../../../ui/forms";
import { FormItemType } from "../../../../ui/forms/enums";
import { GeneralSettings } from "../../../../types/settings";
import { ExtensionModule } from "../../../../enums/settings";

const items: SettingsSectionItem<GeneralSettings>[] = [
  {
    type: FormItemType.GROUP,
    id: "activeModules",
    sectionId: SectionId.GENERAL_SETTINGS,
    label: "Active Modules",
    description: "Enable or disable specific modules.",
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.GENERAL_SETTINGS,
        label: "Finished Module",
        input: toggleSwitch(),
        dataField: `activeModules.${ExtensionModule.FINISHED}`,
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.GENERAL_SETTINGS,
        label: "In Progress Module",
        input: toggleSwitch(),
        dataField: `activeModules.${ExtensionModule.IN_PROGRESS}`,
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.GENERAL_SETTINGS,
        label: "Ignored Module",
        input: toggleSwitch(),
        dataField: `activeModules.${ExtensionModule.IGNORED}`,
      },
    ],
  },
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
