import { createField, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { checkbox, select, text } from "../../../../utils/ui/forms";
import { ButtonPlacement } from "../../../../enums/settings";
import { GeneralSettings } from "../../../../types/settings";

export function buildGeneralSettingsSection(): HTMLElement {
  const hideSymbolsField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Hide symbols",
    input: checkbox(),
    dataField: "hideSymbols",
    description:
      "Whether to hide all symbols next to the title of the works in lists.",
  });

  const buttonPlacementField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Button placement",
    input: select(ButtonPlacement),
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  });

  const replaceMarkForLaterField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Replace 'Mark as Read' button text?",
    input: checkbox(),
    dataField: "replaceMarkForLaterText",
    description:
      "Whether to replace AO3's default 'Mark as Read' button (the one that appears when you mark a work for later) with custom text.",
  });

  const replacementLabelField = createField<GeneralSettings>({
    section: SectionId.GENERAL_SETTINGS,
    label: "Custom label for 'Mark as Read' button",
    input: text("e.g., Finished"),
    dataField: "markForLaterReplacementLabel",
    description:
      "The custom label to use for the 'Mark as Read' button if you have chosen to replace it.",
  });

  return createSettingsSection({
    id: SectionId.GENERAL_SETTINGS,
    title: "General Settings",
    fields: [
      hideSymbolsField,
      buttonPlacementField,
      replaceMarkForLaterField,
      replacementLabelField,
    ],
  });
}
