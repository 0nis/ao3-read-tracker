import { SectionId } from "../../../config";
import { createSettingsSection } from "../../../core/setting/base";
import { SettingsSectionItem } from "../../../core/setting/types";

import { settingsCache } from "../../../../../services/cache";
import { reorderableList } from "../../../../../ui/forms/inputs/reorderable-list";
import { toTitleCase } from "../../../../../utils/string";

import { VerticalPlacement } from "../../../../../enums/settings";
import { FormItemType } from "../../../../../ui/forms/enums";
import { DisplayModeSettings } from "../../../../../types/settings";

const items: SettingsSectionItem<DisplayModeSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Priorities",
    input: reorderableList({
      renderLabel: (mode) => toTitleCase(mode),
    }),
    dataField: "priorities",
    description:
      "When a work matches multiple states and/or statuses with different display modes, this list determines which one takes precedence. Items higher in the list override lower ones.",
    orientation: "vertical",
  },
];

export async function buildDisplayModePrioritesPart(): Promise<HTMLElement> {
  const { displayModeSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.DISPLAY_MODES,
    title: "Display Mode Settings",
    data: displayModeSettings,
    saveButtonPlacement: VerticalPlacement.BOTTOM,
    items,
  });
}
