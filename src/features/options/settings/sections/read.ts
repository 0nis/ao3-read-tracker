import { createField, createFieldGroup, createSettingsSection } from "../base";
import { SectionId } from "../../config";

import { checkbox, select } from "../../../../utils/ui/forms";
import { DisplayMode } from "../../../../enums/settings";
import { ReadSettings } from "../../../../types/settings";
import { SymbolDisplayMode } from "../../../../enums/symbols";

export function buildReadSettingsSection(): HTMLElement {
  // TODO: Replace checkboxes with the new toggle switches
  const simpleField = createField<ReadSettings>({
    section: SectionId.READ_SETTINGS,
    label: "Enable Simple Mode",
    input: checkbox(),
    dataField: "simpleModeEnabled",
    description:
      "If enabled, the read feature will not ask you for additional information like notes. It will simply mark the work as read immediately.",
  });

  const displayModesGroup = createFieldGroup({
    id: "displayModes",
    label: "Display Modes",
    description:
      "Settings related to how the work listings appear after marking them as read.",
    fields: [
      createField<ReadSettings>({
        section: SectionId.READ_SETTINGS,
        label: "Default",
        input: select(DisplayMode),
        dataField: "defaultDisplayMode",
      }),
      createField<ReadSettings>({
        section: SectionId.READ_SETTINGS,
        label: "Reread worthy",
        input: select(DisplayMode),
        dataField: "rereadWorthyDisplayMode",
      }),
      createField<ReadSettings>({
        section: SectionId.READ_SETTINGS,
        label: "Completed",
        input: select(DisplayMode),
        dataField: "completedDisplayMode",
      }),
      createField<ReadSettings>({
        section: SectionId.READ_SETTINGS,
        label: "Abandoned",
        input: select(DisplayMode),
        dataField: "abandonedDisplayMode",
      }),
    ],
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
    fields: [simpleField, displayModesGroup, symbolDisplayModeField],
  });
}
