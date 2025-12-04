import { ImportOptions } from "dexie-export-import";
import { ImportProgress } from "dexie-export-import/dist/import";

import { handleProgressCallback } from "../handlers";

import { IoService } from "../../../../services/io";
import {
  DexieExportDbInfo,
  getDbInfoFromDexieExport,
} from "../../../../utils/file";
import {
  createButtonLoader,
  withLoadingState,
} from "../../../../utils/ui/loaders";
import { createFlashNotice } from "../../../../utils/ui/forms";
import { showNotification } from "../../../../utils/ui/dialogs";
import { LoaderType } from "../../../../enums/ui";
import { DATABASE_NAME } from "../../../../constants/global";

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
      return IoService.import(file, {
        ...options,
        transform: IoService.getMigrationTransformFunc(
          fileInfo.databaseVersion!
        ),
        progressCallback: (progress: ImportProgress) => {
          totalRows ??= progress.totalRows;
          return handleProgressCallback(setProgress, progress);
        },
      });
    },
    { enforceMinDelay: true }
  );
  if (res.success) {
    createFlashNotice(successMsg.replace("%rows%", String(totalRows)));
  } else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Oh no, I couldn't import your data: ${errorMsg}`); // Manual to allow showing Dexie errors without reportExtensionFailure
  }
}

function validateImportFile(info: DexieExportDbInfo): boolean {
  if (info.formatName !== "dexie" || info.databaseName !== DATABASE_NAME) {
    showNotification(
      "Whups, the selected file isn't an export from this extension. Please select a valid file! Only exports from this extension can be imported."
    );
    return false;
  }
  if (!info.databaseVersion) {
    showNotification(
      "The selected file seems to be corrupted or incomplete. Please select a valid export file."
    );
    return false;
  }
  return true;
}
