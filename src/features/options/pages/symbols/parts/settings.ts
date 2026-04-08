import { createSettingsSection } from "../../../core/setting/base";
import { SettingsSectionItem } from "../../../core/setting/types";
import { SectionId } from "../../../config";

import { settingsCache } from "../../../../../services/cache";
import {
  enumSelect,
  number,
  toggleSwitch,
} from "../../../../../utils/ui/forms";
import { FormItemType } from "../../../../../enums/forms";
import {
  SymbolFallbackType,
  SymbolRenderMode,
} from "../../../../../enums/symbols";
import { VerticalPlacement } from "../../../../../enums/settings";
import { SymbolSettings } from "../../../../../types/settings";
import { DEFAULT_SYMBOL_SIZE_EM } from "../../../../../constants/global";

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
    type: FormItemType.GROUP,
    id: "advancedSymbolSettings",
    sectionId: SectionId.SYMBOL_SETTINGS,
    label: "Advanced Symbol Settings",
    description: "Click to expand/collapse.",
    collapsible: true,
    collapsedByDefault: true,
    boldFieldLabels: true,
    fields: [
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.SYMBOL_SETTINGS,
        label: "Size",
        input: number({ defaultValue: DEFAULT_SYMBOL_SIZE_EM }),
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
        description: "What to display in case a symbol is missing or invalid.",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.SYMBOL_SETTINGS,
        label: "Enable Emoji Scaling",
        input: toggleSwitch(),
        dataField: "emojiScalingEnabled",
        description:
          "Scale emojis down so they visually match inline images. In most fonts, emojis appear slightly larger than text at the same font size.",
      },
      {
        type: FormItemType.FIELD,
        sectionId: SectionId.SYMBOL_SETTINGS,
        label: "Emoji Scale Factor",
        input: number({ defaultValue: 0.83, min: 0.5, max: 2 }),
        dataField: "emojiScaleFactor",
        description:
          "If emoji scaling is enabled, this multiplier determines the emoji size relative to the symbol size defined in the size field. For example, 0.83 makes the emoji about 17% smaller.",
      },
    ],
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
