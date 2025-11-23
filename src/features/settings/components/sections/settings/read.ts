import { PREFIX } from "../../..";
import { DisplayMode } from "../../../../../constants/enums";
import { el } from "../../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../../utils/ui/form";
import { createField, createSettingsSection } from "./base";

export function buildReadSection(): HTMLElement {
  const simpleField = createField({
    section: "read",
    label: "Enable Simple Mode",
    input: el("input", { type: "checkbox" }),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  });

  const defaultDisplayField = createField({
    section: "read",
    label: "Default Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as read. For example, 'collapse gentle' will hide everything but the header.",
  });

  const stillReadingDisplayField = createField({
    section: "read",
    label: "Still reading Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "stillReadingDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as still reading.",
  });

  const rereadDisplayField = createField({
    section: "read",
    label: "Reread worthy Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "rereadWorthyDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as reread worthy.",
  });

  return createSettingsSection({
    id: "read",
    title: "Read Settings",
    fields: [
      simpleField,
      defaultDisplayField,
      stillReadingDisplayField,
      rereadDisplayField,
    ],
  });
}
