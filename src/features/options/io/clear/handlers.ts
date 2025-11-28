import {
  confirmDestructiveAction,
  showNotification,
} from "../../../../utils/ui/dialogs";

export async function handleClearData(btn: HTMLButtonElement) {
  const confirmed = confirmDestructiveAction(
    "Are you sure you want to clear all stored data? This will reset the extension to its default state. YOUR DATA WILL BE LOST. PERMANENTLY. NO TAKE-BACKSIES. Do you want to proceed?",
    "I UNDERSTAND, DELETE ALL OF MY DATA"
  );
  if (!confirmed) showNotification("Clear data action cancelled.");
}
