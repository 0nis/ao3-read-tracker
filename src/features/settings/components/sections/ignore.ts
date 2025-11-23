import { PREFIX } from "../..";
import { DisplayMode } from "../../../../constants/enums";
import { el } from "../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../utils/ui/form";
import { createField, createSection } from "./base";

export function buildIgnoreSection(): HTMLElement {
  const simpleField = createField({
    section: "ignore",
    label: "Enable Simple Mode",
    input: el("input", { type: "checkbox" }),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the ignore feature will not ask you for a reason first. It will simply mark the work as ignored immediately.",
  });

  const defaultDisplayField = createField({
    section: "ignore",
    label: "Default Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've ignored said work. For example, 'collapse aggressive' will hide all details",
  });

  return createSection({
    id: "ignore",
    title: "Ignore Settings",
    fields: [simpleField, defaultDisplayField],
  });
}
