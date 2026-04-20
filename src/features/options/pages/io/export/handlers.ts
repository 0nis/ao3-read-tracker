import { ExportProgress } from "dexie-export-import";

import { handleProgressCallback } from "../handlers";

import { IoService } from "../../../../../services/io";
import { LoaderType } from "../../../../../enums/ui";
import {
  createButtonLoader,
  withLoadingState,
} from "../../../../../utils/ui/loaders/element";
import { downloadFile } from "../../../../../utils/file";
import {
  reportExtensionFailure,
  showNotification,
} from "../../../../../utils/ui/dialogs";

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
      downloadFile(res.data, "export");
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
