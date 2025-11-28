import { LoaderType } from "../../../../enums/ui";
import { IoService } from "../../../../services/io";
import {
  confirmDestructiveAction,
  reportExtensionFailure,
  showNotification,
} from "../../../../utils/ui/dialogs";
import { createFlashNotice } from "../../../../utils/ui/form";
import {
  createButtonLoader,
  withLoadingState,
} from "../../../../utils/ui/loaders";

export async function handleClearData(btn: HTMLButtonElement) {
  const confirmed = confirmDestructiveAction(
    "Are you sure you want to clear all stored data? This will reset the extension to its default state. YOUR DATA WILL BE LOST. PERMANENTLY. NO TAKE-BACKSIES. Do you want to proceed?",
    "I UNDERSTAND, DELETE ALL OF MY DATA"
  );
  if (!confirmed) {
    showNotification("Clear data action cancelled.");
    return;
  }

  const controller = createButtonLoader(btn, LoaderType.SPINNER);
  const res = await withLoadingState(
    controller,
    async () => await IoService.clear(),
    { enforceMinDelay: true }
  );

  if (res.success) {
    createFlashNotice(
      "All stored data has been cleared successfully, and your settings have been reset to their default values."
    );
  } else {
    reportExtensionFailure(
      "Something went wrong while clearing your data!",
      res.error
    );
  }
}
