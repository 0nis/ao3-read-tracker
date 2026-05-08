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
        dataField: `modules.${ExtensionModule.FINISHED}.enabled`,
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.GENERAL_SETTINGS,
        label: "In Progress Module",
        input: toggleSwitch(),
        dataField: `modules.${ExtensionModule.IN_PROGRESS}.enabled`,
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.GENERAL_SETTINGS,
        label: "Ignored Module",
        input: toggleSwitch(),
        dataField: `modules.${ExtensionModule.IGNORED}.enabled`,
      },
    ],
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
