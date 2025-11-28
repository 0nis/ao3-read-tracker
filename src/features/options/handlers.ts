import { ImportOptions, ImportProgress } from "dexie-export-import/dist/import";
import {
  confirmDestructiveAction,
  reportExtensionFailure,
  showConfirm,
  showNotification,
} from "../../utils/ui/dialogs";
import { StorageService } from "../../services/storage";
import { createFlashNotice, showFormMessage } from "../../utils/ui/form";
import {
  handleStorageRead,
  handleStorageWrite,
} from "../../utils/storage/handlers";
import { ExportProgress } from "dexie-export-import";
import { getManifest } from "../../utils/extension/manifest";
import { getFormattedDateTimeForFilename } from "../../utils/date";
import { downloadFile, getDbInfoFromDexieExport } from "../../utils/file";
import { createButtonLoader, withLoadingState } from "../../utils/ui/loaders";
import { LoaderType } from "../../enums/ui";
import { DATABASE_NAME, DATABASE_VERSION } from "../../constants/global";

export function setupHeaderActions(
  exportBtn: HTMLButtonElement,
  importBtn: HTMLButtonElement,
  clearBtn: HTMLButtonElement
) {
  // exportBtn.addEventListener("click", () => {
  //   // TODO: Implement data exporting logic
  //   showNotification("Exporting data...");
  // });
  // importBtn.addEventListener("click", async () => {
  //   const confirmed = await confirmDestructiveAction(
  //     "Importing data will overwrite your existing data. Are you sure you want to proceed?",
  //     "IMPORT DATA"
  //   );
  //   if (confirmed) {
  //     // TODO: Implement data importing logic
  //     showNotification("Importing data...");
  //   } else showNotification("Data import action cancelled.");
  // });
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

export async function handleImport(
  e: Event,
  file: Blob,
  options: ImportOptions
) {
  const fileInfo = await getDbInfoFromDexieExport(file);
  if (
    fileInfo.formatName !== "dexie" ||
    fileInfo.databaseName !== DATABASE_NAME
  ) {
    showNotification(
      "Data import failed: The selected file isn't an export from this extension. Please select a valid export file!"
    );
    return;
  }
  // TODO: Fix. e.currentTarget is not a button!
  console.log(typeof e.currentTarget, "type: ", typeof e.currentTarget);
  const btn = e.currentTarget as HTMLButtonElement;

  const controller = createButtonLoader(btn, LoaderType.PROGRESS);
  const res = await withLoadingState(
    controller,
    async (setProgress) => {
      return StorageService.import(new Blob(), fileInfo.databaseVersion ?? 0, {
        ...options,
        progressCallback: ({
          completedRows,
          totalRows,
          completedTables,
          totalTables,
        }: ImportProgress) => {
          let percent;
          if (totalRows !== undefined)
            percent = Math.round((completedRows / totalRows) * 100);
          else percent = Math.round((completedTables / totalTables) * 100);
          setProgress?.(percent);
          return true;
        },
      });
    },
    { enforceMinDelay: true, minDelayMs: 3000 } // TODO: Remove (is for testing)
  );
  if (res.success) createFlashNotice("Data imported successfully.");
  else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Data import failed: ${errorMsg}`); // Manual to allow showing Dexie errors without reportExtensionFailure
  }
}

export async function handleExport(e: Event) {
  const btn = e.currentTarget as HTMLButtonElement;

  const controller = createButtonLoader(btn, LoaderType.PROGRESS);
  const res = await withLoadingState(
    controller,
    async (setProgress) => {
      return StorageService.export({
        progressCallback: ({
          completedRows,
          totalRows,
          completedTables,
          totalTables,
        }: ExportProgress) => {
          let percent;
          if (totalRows !== undefined)
            percent = Math.round((completedRows / totalRows) * 100);
          else percent = Math.round((completedTables / totalTables) * 100);

          setProgress?.(percent);
          return true;
        },
      });
    },
    { enforceMinDelay: true, minDelayMs: 3000 } // TODO: Remove (is for testing)
  );

  if (res.success && res.data) {
    try {
      downloadFile(res.data, "export");
    } catch (error) {
      reportExtensionFailure("Failed to download exported data.", error);
      return;
    }
  } else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Data export failed: ${errorMsg}`);
  }
}

export async function handleOverwriteImport(e: Event, file: Blob) {
  const confirmed = await confirmDestructiveAction(
    "Importing data will overwrite your existing data. That means YOUR CURRENT DATA WILL BE LOST. Do you want to proceed?",
    "OVERWRITE MY DATA"
  );
  if (!confirmed) showNotification("Data import action cancelled.");

  await handleImport(e, file, {
    overwriteValues: true,
    clearTablesBeforeImport: true,
  });
}

export async function handleMergeImport(e: Event, file: Blob) {
  const confirmed = await confirmDestructiveAction(
    "Importing data will merge with your existing data. CONFLICTING ENTRIES WILL BE OVERWRITTEN. Do you want to proceed?",
    "MERGE MY DATA"
  );
  if (!confirmed) showNotification("Data import action cancelled.");

  await handleImport(e, file, {
    overwriteValues: true,
    clearTablesBeforeImport: false,
  });
}

export async function handleImportOnlyNew(e: Event, file: Blob) {
  const confirmed = await showConfirm(
    "Importing data will add only new entries to your existing data. No current data will be overwritten. Do you want to proceed?"
  );
  if (!confirmed) showNotification("Data import action cancelled.");
  await handleImport(e, file, {
    overwriteValues: false,
    clearTablesBeforeImport: false,
  });
}
