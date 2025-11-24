import { PREFIX } from "../../..";
import { ButtonPlacement } from "../../../../../constants/enums";
import { el } from "../../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../../utils/ui/form";
import { SectionId } from "../../../sections";
import { createField, createSettingsSection } from "./base";

export function buildGeneralSettingsSection(): HTMLElement {
  const hideSymbolsField = createField({
    section: SectionId.GENERAL_SETTINGS,
    label: "Hide symbols?",
    input: el("input", { type: "checkbox" }),
    dataField: "hideSymbols",
    description: "Toggles the emojis next to the title of the works in lists.",
  });

  const buttonPlacementField = createField({
    section: SectionId.GENERAL_SETTINGS,
    label: "Button placement",
    input: buildSelectFromEnum(ButtonPlacement) as HTMLElement,
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  });

  const replaceMarkForLaterField = createField({
    section: SectionId.GENERAL_SETTINGS,
    label: "Replace 'Mark as Read' button text?",
    input: el("input", { type: "checkbox" }),
    dataField: "replaceMarkForLaterText",
    description:
      "Whether to replace AO3's default 'Mark as Read' button (the one that appears when you mark a work for later) with custom text.",
  });

  const replacementLabelField = createField({
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
      hideSymbolsField,
      buttonPlacementField,
      replaceMarkForLaterField,
      replacementLabelField,
    ],
  });
}
