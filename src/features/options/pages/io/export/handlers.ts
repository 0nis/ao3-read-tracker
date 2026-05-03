import { ExportProgress } from "dexie-export-import";

import { handleProgressCallback } from "../handlers";

import { IoService } from "../../../../../services/storage/io";
import { getManifest } from "../../../../../shared/extension/manifest";
import {
  createButtonLoader,
  withLoadingState,
} from "../../../../../ui/components/loaders/element";
import { downloadBlob } from "../../../../../utils/file";
import {
  reportExtensionFailure,
  showNotification,
} from "../../../../../shared/extension/dialogs";
import { toKebabCase } from "../../../../../utils/string";
import { getFormattedDateTimeForFilename } from "../../../../../utils/date";
import { LoaderType } from "../../../../../enums/ui";

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
        `${toKebabCase(getManifest()?.data?.name || "extension")}_export_${getFormattedDateTimeForFilename(
          Date.now(),
        )}.json`,
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
