import { PREFIX } from "../../..";
import { DisplayMode } from "../../../../../enums/settings";
import { el } from "../../../../../utils/ui/dom";
import { buildSelectFromEnum } from "../../../../../utils/ui/form";
import { SectionId } from "../../../sections";
import { createField, createSettingsSection } from "./base";

export function buildIgnoreSettingsSection(): HTMLElement {
  const simpleField = createField({
    section: SectionId.IGNORE_SETTINGS,
    label: "Enable Simple Mode",
    input: el("input", { type: "checkbox" }),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the ignore feature will not ask you for a reason first. It will simply mark the work as ignored immediately.",
  });

  const defaultDisplayField = createField({
    section: SectionId.IGNORE_SETTINGS,
    label: "Default Display Mode",
    input: buildSelectFromEnum(DisplayMode) as HTMLElement,
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've ignored said work. For example, 'collapse aggressive' will hide all details",
  });

  return createSettingsSection({
    id: SectionId.IGNORE_SETTINGS,
    title: "Ignore Settings",
    fields: [simpleField, defaultDisplayField],
  });
}
