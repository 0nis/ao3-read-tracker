import { getElement } from "../../utils/ui/dom";
import {
  confirmDestructiveAction,
  showNotification,
} from "../../utils/ui/dialogs";
import { handleStorageWrite } from "../../utils/storage/handlers";
import { handleGetAllSettings } from "../../utils/storage/settings";
import { extractSectionValues, populateSection } from "../../utils/ui/form";

import { StorageResult } from "../../types/storage";

import { PREFIX } from ".";
import { SectionId, SETTINGS_LOAD_MAP, SETTINGS_SAVE_MAP } from "./sections";
import { SectionElements } from "./renderer";

async function updateSettingsHandler(
  op: Promise<StorageResult<void>>,
  label: string,
  saveBtn: HTMLElement | null = null
) {
  await handleStorageWrite<void>(
    op,
    `${
      label.charAt(0).toUpperCase() + label.slice(1)
    } settings updated successfully.`,
    `Failed to update ${label} settings.`,
    saveBtn || undefined,
    false
  );
}

export async function loadAllSettingsSections(sections: SectionElements) {
  const all = await handleGetAllSettings();

  for (const id of Object.keys(sections) as SectionId[]) {
    const section = sections[id];
    const getData = SETTINGS_LOAD_MAP[id];
    if (!getData) continue;

    const data = getData(all);
    if (data) {
      populateSection(section.element, data);
    }
  }
}

export function setupSettingsSaveHandlers(sections: SectionElements) {
  for (const [key, sectionConfig] of Object.entries(sections)) {
    const saveBtn = getElement(sectionConfig.element, `.${PREFIX}__button`);
    if (!saveBtn) continue;

    const saveInfo = SETTINGS_SAVE_MAP[key as SectionId];
    if (!saveInfo) continue;

    saveBtn.addEventListener("click", async () => {
      const payload = {
        ...saveInfo.defaults,
        ...extractSectionValues(sectionConfig.element),
      };

      const op = saveInfo.setter(payload);

      await updateSettingsHandler(op, saveInfo.label, saveBtn);
    });
  }
}

export function setupHeaderActions(
  exportBtn: HTMLButtonElement,
  importBtn: HTMLButtonElement,
  clearBtn: HTMLButtonElement
) {
  exportBtn.addEventListener("click", () => {
    // TODO: Implement data exporting logic
    showNotification("Exporting data...");
  });
  importBtn.addEventListener("click", async () => {
    const confirmed = await confirmDestructiveAction(
      "Importing data will overwrite your existing data. Are you sure you want to proceed?",
      "IMPORT DATA"
    );
    if (confirmed) {
      // TODO: Implement data importing logic
      showNotification("Importing data...");
    } else showNotification("Data import action cancelled.");
  });
  clearBtn.addEventListener("click", async () => {
    const confirmed = await confirmDestructiveAction(
      "Are you sure you want to clear all stored data? This action cannot be undone.",
      "DELETE MY DATA"
    );
    if (confirmed) {
      showNotification("All stored data has been cleared.");
      // TODO: Implement data clearing logic
    } else showNotification("Data clear action cancelled.");
  });
}
