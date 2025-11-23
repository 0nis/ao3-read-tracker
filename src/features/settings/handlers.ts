import { StorageService } from "../../services/storage";

import { getElement } from "../../utils/ui/dom";
import {
  confirmDestructiveAction,
  showNotification,
} from "../../utils/ui/dialogs";
import {
  handleStorageRead,
  handleStorageWrite,
} from "../../utils/storage/handlers";
import { extractSectionValues, populateSection } from "../../utils/ui/form";

import { StorageResult } from "../../types/storage";

import { PREFIX } from ".";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";

async function getSettingsHandler<T>(
  op: Promise<StorageResult<T>>,
  defaultSettings: T,
  label: string
): Promise<T> {
  return await handleStorageRead<T>(
    op,
    defaultSettings,
    `Failed to retrieve ${label} settings. Using default settings.`,
    false
  );
}

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

export async function loadAllSections(
  readSection: HTMLElement,
  ignoreSection: HTMLElement,
  generalSection: HTMLElement
) {
  const read = await getSettingsHandler(
    StorageService.readSettings.get(),
    DEFAULT_READ_SETTINGS,
    "Read"
  );
  populateSection(readSection, read!);

  const ignore = await getSettingsHandler(
    StorageService.ignoreSettings.get(),
    DEFAULT_IGNORE_SETTINGS,
    "Ignore"
  );
  populateSection(ignoreSection, ignore!);

  const general = await getSettingsHandler(
    StorageService.generalSettings.get(),
    DEFAULT_GENERAL_SETTINGS,
    "General"
  );
  populateSection(generalSection, general!);
}

export function setupSaveHandlers(
  readSection: HTMLElement,
  ignoreSection: HTMLElement,
  generalSection: HTMLElement
) {
  const readSave = getElement(
    readSection,
    `.${PREFIX}__button`
  ) as HTMLInputElement;
  readSave.addEventListener("click", async () => {
    await updateSettingsHandler(
      StorageService.readSettings.set({
        ...DEFAULT_READ_SETTINGS,
        ...extractSectionValues(readSection),
      }),
      "read",
      readSave
    );
  });

  const ignoreSave = getElement(
    ignoreSection,
    `.${PREFIX}__button`
  ) as HTMLInputElement;
  ignoreSave.addEventListener("click", async () => {
    await updateSettingsHandler(
      StorageService.ignoreSettings.set({
        ...DEFAULT_IGNORE_SETTINGS,
        ...extractSectionValues(ignoreSection),
      }),
      "ignore",
      ignoreSave
    );
  });

  const generalSave = getElement(
    generalSection,
    `.${PREFIX}__button`
  ) as HTMLInputElement;
  generalSave.addEventListener("click", async () => {
    await updateSettingsHandler(
      StorageService.generalSettings.set({
        ...DEFAULT_GENERAL_SETTINGS,
        ...extractSectionValues(generalSection),
      }),
      "general",
      generalSave
    );
  });
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
