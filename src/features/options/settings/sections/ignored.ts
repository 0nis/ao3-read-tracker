import { createField, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { checkbox, select } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { IgnoreSettings } from "../../../../types/settings";

export function buildIgnoreSettingsSection(): HTMLElement {
  const simpleField = createField<IgnoreSettings>({
    section: SectionId.IGNORE_SETTINGS,
    label: "Enable Simple Mode",
    input: checkbox(),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the ignore feature will not ask you for a reason first. It will simply mark the work as ignored immediately.",
  });

  const defaultDisplayField = createField<IgnoreSettings>({
    section: SectionId.IGNORE_SETTINGS,
    label: "Default Display Mode",
    input: select(DisplayMode),
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
