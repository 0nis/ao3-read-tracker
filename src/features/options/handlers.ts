import {
  confirmDestructiveAction,
  showNotification,
} from "../../utils/ui/dialogs";

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
