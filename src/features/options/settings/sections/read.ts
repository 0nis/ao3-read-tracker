import { createField, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { checkbox, select } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { ReadSettings } from "../../../../types/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";

export function buildReadSettingsSection(): HTMLElement {
  const simpleField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Enable Simple Mode",
    input: checkbox(),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  });

  // TODO: Create setting "groups" for things like this
  const defaultDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Default Display Mode",
    input: select(DisplayMode),
    dataField: "defaultDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as read. For example, 'collapse gentle' will hide everything but the header.",
  });

  const rereadDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Reread worthy Display Mode",
    input: select(DisplayMode),
    dataField: "rereadWorthyDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as reread worthy.",
  });

  const completedDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Completed Display Mode",
    input: select(DisplayMode),
    dataField: "completedDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as completed.",
  });

  const abandonedDisplayField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Abandoned Display Mode",
    input: select(DisplayMode),
    dataField: "abandonedDisplayMode",
    description:
      "What the work listing will look like when you've marked a work as abandoned.",
  });

  const symbolDisplayModeField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Symbol Display Mode",
    input: select(SymbolDisplayMode),
    dataField: "symbolDisplayMode",
    description:
      "Controls how symbols are displayed next to the title of the works in lists. 'State' means read or in progress, 'status' means finished, abandoned, paused, etc.",
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
      symbolDisplayModeField,
    ],
  });
}
