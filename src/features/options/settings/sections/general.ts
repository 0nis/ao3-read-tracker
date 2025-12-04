import { createField, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { el } from "../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../utils/ui/forms";
import { ButtonPlacement } from "../../../../enums/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";
import { GeneralSettings } from "../../../../types/settings";

export function buildGeneralSettingsSection(): HTMLElement {
  const symbolDisplayModeField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Symbol display mode",
    input: buildSelectFromEnum(SymbolDisplayMode) as HTMLElement,
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means read or in progress, 'status' means finished, abandoned, paused, etc.",
  });

  const buttonPlacementField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Button placement",
    input: buildSelectFromEnum(ButtonPlacement) as HTMLElement,
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  });

  const replaceMarkForLaterField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Replace 'Mark as Read' button text?",
    input: el("input", { type: "checkbox" }),
    dataField: "replaceMarkForLaterText",
    description:
      "Whether to replace AO3's default 'Mark as Read' button (the one that appears when you mark a work for later) with custom text.",
  });

  const replacementLabelField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Custom label for 'Mark as Read' button",
    input: el("input", {
      type: "text",
      placeholder: "e.g., Finished",
    }),
    dataField: "markForLaterReplacementLabel",
    description:
      "The custom label to use for the 'Mark as Read' button if you have chosen to replace it.",
  });

  return createSettingsSection({
    id: SectionId.GENERAL_SETTINGS,
    title: "General Settings",
    fields: [
      symbolDisplayModeField,
      buttonPlacementField,
      replaceMarkForLaterField,
      replacementLabelField,
    ],
  });
}
