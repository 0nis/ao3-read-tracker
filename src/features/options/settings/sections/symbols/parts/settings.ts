import { createSettingsSection } from "../../../base";
import { SettingsSectionItem } from "../../../types";
import { SectionId } from "../../../../config";

import { settingsCache } from "../../../../../../services/cache";
import {
  enumSelect,
  number,
  toggleSwitch,
} from "../../../../../../utils/ui/forms";
import { FormItemType } from "../../../../../../enums/forms";
import {
  SymbolFallbackType,
  SymbolRenderMode,
} from "../../../../../../enums/symbols";
import { VerticalPlacement } from "../../../../../../enums/settings";
import { SymbolSettings } from "../../../../../../types/settings";

// TODO: Actually apply these settings throughout the application
// enabled: DONE
// size: DONE
// renderMode: DONE
// fallback: DONE
const items: SettingsSectionItem<SymbolSettings>[] = [
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Enable Symbols",
    input: toggleSwitch(),
    dataField: "enabled",
    description:
      "If enabled, symbols will be shown next to the title of the works in lists.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Size",
    input: number({ defaultValue: 1.2 }),
    dataField: "size",
    description:
      "Takes a size value in the CSS unit <code>em</code>. 1 em equals the current font size. For example, 1.2 em would be 20% larger than the size of the text.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Render Mode",
    input: enumSelect(SymbolRenderMode),
    dataField: "renderMode",
    description:
      "When 'auto' is selected, the symbol will be rendered using the provided image, if available. Otherwise, the emoji will be used.",
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Fallback",
    input: enumSelect(SymbolFallbackType),
    dataField: "fallbackType",
    description: "What to display in case a symbol is missing.",
  },
];

export async function buildSymbolSettingsPart(): Promise<HTMLElement> {
  const { symbolSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.SYMBOL_SETTINGS,
    title: "Symbol Settings",
    data: symbolSettings,
    saveButtonPlacement: VerticalPlacement.BOTTOM,
    items,
  });
}
