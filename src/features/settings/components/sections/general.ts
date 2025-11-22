import { PREFIX } from "../..";
import { ButtonPlacement } from "../../../../constants/enums";
import { el } from "../../../../utils/dom";
import { buildSelectFromEnum } from "../../../../utils/form";
import { createField, createSection } from "./base";

export function buildGeneralSection(): HTMLElement {
  const hideSymbolsField = createField({
    section: "general",
    label: "Hide symbols?",
    input: el("input", { type: "checkbox" }),
    dataField: "hideSymbols",
    description:
      "Toggles the emojis next to the title of the fics in the Works list.",
  });

  const buttonPlacementField = createField({
    section: "general",
    label: "Button placement",
    input: buildSelectFromEnum(ButtonPlacement) as HTMLElement,
    dataField: "buttonPlacement",
    description:
      "Choose where the 'Mark as Read' and 'Ignore' buttons appear on work pages.",
  });

  const replaceMarkForLaterField = createField({
    section: "general",
    label: "Replace 'Mark as Read' button text?",
    input: el("input", { type: "checkbox" }),
    dataField: "replaceMarkForLaterText",
    description:
      "Whether to replace AO3's default 'Mark as Read' button (the one that appears when you mark a fic for later) with custom text.",
  });

  const replacementLabelField = createField({
    section: "general",
    label: "Custom label for 'Mark as Read' button",
    input: el("input", {
      type: "text",
      placeholder: "e.g., Finished",
    }),
    dataField: "markForLaterReplacementLabel",
    description:
      "The custom label to use for the 'Mark as Read' button if you have chosen to replace it.",
  });

  return createSection({
    id: "general",
    title: "General Settings",
    fields: [
      hideSymbolsField,
      buttonPlacementField,
      replaceMarkForLaterField,
      replacementLabelField,
    ],
  });
}
