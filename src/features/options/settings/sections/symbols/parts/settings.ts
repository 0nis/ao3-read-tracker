import { createSettingsSection } from "../../../base";
import { SettingsSectionItem } from "../../../types";
import { SectionId } from "../../../../config";

import { settingsCache } from "../../../../../../services/cache";
import {
  enumSelect,
  text,
  toggleSwitch,
} from "../../../../../../utils/ui/forms";
import { FormItemType } from "../../../../../../enums/forms";
import {
  SymbolFallback,
  SymbolRenderMode,
} from "../../../../../../enums/symbols";
import { VerticalPlacement } from "../../../../../../enums/settings";
import { SymbolSettings } from "../../../../../../types/settings";

// TODO: Actually apply these settings throughout the application
// enabled: DONE
// size: todo
// renderMode: todo
// fallback: todo
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
    input: text("", "e.g., 1.2em"),
    dataField: "size",
    description:
      "Takes a <a href='https://www.w3schools.com/cssref/css_units.php' target='_blank'>CSS unit value</a> and applies it to the size of the symbols.",
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
    input: enumSelect(SymbolFallback),
    dataField: "fallback",
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
