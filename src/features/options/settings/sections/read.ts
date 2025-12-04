import { createField, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { el } from "../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { ReadSettings } from "../../../../types/settings";

export function buildReadSettingsSection(): HTMLElement {
  const simpleField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Enable Simple Mode",
    input: el("input", { type: "checkbox" }),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  });

  // TODO: Create setting "groups" for things like this
  const defaultDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Default Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as read. For example, 'collapse gentle' will hide everything but the header.",
  });

  const rereadDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Reread worthy Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "rereadWorthyDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as reread worthy.",
  });

  const completedDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Completed Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "completedDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as completed.",
  });

  const abandonedDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Abandoned Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "abandonedDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as abandoned.",
  });

  return createSettingsSection({
    id: SectionId.READ_SETTINGS,
    title: "Read Settings",
    fields: [
      simpleField,
      defaultDisplayField,
      rereadDisplayField,
      completedDisplayField,
      abandonedDisplayField,
    ],
  });
}
