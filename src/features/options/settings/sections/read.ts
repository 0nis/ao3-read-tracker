import { DisplayMode } from "@enums";
import { el, buildSelectFromEnum } from "@utils/ui";

import { SectionId } from "../../config";
import { createField, createSettingsSection } from "../base";

export function buildReadSettingsSection(): HTMLElement {
  const simpleField = createField({
    section: SectionId.READ_SETTINGS,
    label: "Enable Simple Mode",
    input: el("input", { type: "checkbox" }),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  });

  const defaultDisplayField = createField({
    section: SectionId.READ_SETTINGS,
    label: "Default Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as read. For example, 'collapse gentle' will hide everything but the header.",
  });

  const stillReadingDisplayField = createField({
    section: SectionId.READ_SETTINGS,
    label: "Still reading Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "stillReadingDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as still reading.",
  });

  const rereadDisplayField = createField({
    section: SectionId.READ_SETTINGS,
    label: "Reread worthy Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "rereadWorthyDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as reread worthy.",
  });

  return createSettingsSection({
    id: SectionId.READ_SETTINGS,
    title: "Read Settings",
    fields: [
      simpleField,
      defaultDisplayField,
      stillReadingDisplayField,
      rereadDisplayField,
    ],
  });
}
