import {
  getManifest,
  replaceManifestPlaceholders,
  error,
  info,
  createExtensionMsg,
} from "../extension";

/**
 * Displays a critical message that requires user attention.
 * Uses the native alert dialog.
 */
export function showNotification(message: string): void {
  alert(createExtensionMsg(message));
}

/**
 * Asks for user confirmation on an action.
 * Uses the native confirm dialog.
 */
export function showConfirm(message: string): boolean {
  return confirm(createExtensionMsg(message));
}

/**
 * Asks for confirmation of a destructive action by requiring the user to type a specific phrase.
 * Prevents accidental clicks on dangerous operations like clearing all data.
 * Uses the native prompt dialog with case-sensitive matching.
 *
 * @param message The warning message to display
 * @param confirmPhrase The exact phrase the user must type (case-sensitive)
 */
export function confirmDestructiveAction(
  message: string,
  confirmPhrase: string
): boolean {
  const userInput = prompt(
    createExtensionMsg(
      `${message}\n\nPlease type "${confirmPhrase}" to confirm.`
    )
  );
  return userInput?.toUpperCase() === confirmPhrase.toUpperCase();
}

/**
 * Reports a critical extension failure to the user and console.
 * Used when something catastrophic prevents the extension from functioning.
 *
 * @param msg The error message template. Use %name%, %version%, %url%, %author%, %description% for manifest placeholders.
 * @param err The error object that caused the failure
 */
export function reportExtensionFailure(msg: string, err?: unknown): void {
  const message = replaceManifestPlaceholders(msg);
  const url = getManifest().data?.homepage_url || "[url unknown]";

  error(message, err);
  info("To help fix this, please report the issue at:", url);

  showNotification(
    `${message}\n\n` +
      `To help fix this, please report the issue at:\n` +
      `${url}\n\n` +
      `Thank you!`
  );
}
