import { ImportOptions, ImportProgress } from "dexie-export-import/dist/import";
import { ExportProgress } from "dexie-export-import";

import { IoService } from "../../services/io";

import {
  confirmDestructiveAction,
  reportExtensionFailure,
  showNotification,
} from "../../utils/ui/dialogs";
import { createFlashNotice } from "../../utils/ui/form";
import {
  DexieExportDbInfo,
  downloadFile,
  getDbInfoFromDexieExport,
} from "../../utils/file";
import { createButtonLoader, withLoadingState } from "../../utils/ui/loaders";

import { LoaderType } from "../../enums/ui";
import { DATABASE_NAME } from "../../constants/global";

export function setupHeaderActions(clearBtn: HTMLButtonElement) {
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
  btn: HTMLButtonElement,
  file: Blob,
  options: ImportOptions,
  successMsg: string = "Yippee, successfully imported %rows% rows of data!"
) {
  const fileInfo = await getDbInfoFromDexieExport(file);
  if (!validateImportFile(fileInfo)) return;

  const controller = createButtonLoader(btn, LoaderType.PROGRESS);
  let totalRows;
  const res = await withLoadingState(
    controller,
    async (setProgress) => {
      return IoService.import(file, fileInfo.databaseVersion ?? 0, {
        ...options,
        progressCallback: (progress: ImportProgress) => {
          totalRows ??= progress.totalRows;
          return handleProgress(setProgress, progress);
        },
      });
    },
    { enforceMinDelay: true }
  );
  if (res.success)
    createFlashNotice(successMsg.replace("%rows%", String(totalRows)));
  else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Oh no, I couldn't import your data: ${errorMsg}`); // Manual to allow showing Dexie errors without reportExtensionFailure
  }
}

export async function handleExport(btn: HTMLButtonElement) {
  const controller = createButtonLoader(btn, LoaderType.PROGRESS);
  const res = await withLoadingState(
    controller,
    async (setProgress) => {
      return IoService.export({
        progressCallback: (progress: ExportProgress) => {
          return handleProgress(setProgress, progress);
        },
      });
    },
    { enforceMinDelay: true }
  );

  if (res.success && res.data) {
    try {
      downloadFile(res.data, "export");
    } catch (error) {
      reportExtensionFailure("Oops, failed to download exported data!", error);
      return;
    }
  } else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Oops, failed to download exported data: ${errorMsg}`);
  }
}

function handleProgress(
  setProgress: ((v: number) => void) | undefined,
  {
    completedRows,
    totalRows,
    completedTables,
    totalTables,
  }: ImportProgress | ExportProgress
) {
  const percent =
    totalRows !== undefined
      ? Math.round((completedRows / totalRows) * 100)
      : Math.round((completedTables / totalTables) * 100);

  setProgress?.(percent);
  return true;
}

function validateImportFile(info: DexieExportDbInfo): boolean {
  if (info.formatName !== "dexie" || info.databaseName !== DATABASE_NAME) {
    showNotification(
      "Whups, the selected file isn't an export from this extension. Please select a valid file! Only exports from this extension can be imported."
    );
    return false;
  }
  return true;
}
