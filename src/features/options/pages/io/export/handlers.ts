import { ExportProgress } from "dexie-export-import";

import { handleProgressCallback } from "../handlers";

import { IoService } from "../../../../../services/storage/io";
import {
  createButtonLoader,
  withLoadingState,
} from "../../../../../ui/components/loaders/element";
import { downloadBlob } from "../../../../../utils/file";
import {
  reportExtensionFailure,
  showNotification,
} from "../../../../../shared/extension/dialogs";
import { LoaderType } from "../../../../../enums/ui";
import { getBackupFileName } from "../../../../../shared/string";

export async function handleExport(btn: HTMLButtonElement) {
  const controller = createButtonLoader(btn, LoaderType.PROGRESS);
  const res = await withLoadingState(
    controller,
    async (setProgress) => {
      return IoService.export({
        progressCallback: (progress: ExportProgress) => {
          return handleProgressCallback(setProgress, progress);
        },
      });
    },
    { enforceMinDelay: true },
  );

  if (res.success && res.data) {
    try {
      downloadBlob(
        res.data,
        getBackupFileName({
          fileType: "json",
          type: "export",
          datetime: Date.now(),
        }),
      );
    } catch (error) {
      reportExtensionFailure("Failed to download exported data!", error);
      return;
    }
  } else {
    const errorMsg =
      res.error instanceof Error ? res.error.message : String(res.error);
    showNotification(`Failed to download exported data: ${errorMsg}`);
  }
}
