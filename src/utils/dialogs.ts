import { getManifest, replaceManifestPlaceholders } from "./manifest";

/**
 * Displays a critical message that requires user attention.
 * Uses the native alert dialog.
 */
export function showNotification(message: string): void {
  alert(message);
}

/**
 * Asks for user confirmation on an action.
 * Uses the native confirm dialog.
 */
export function showConfirm(message: string): Promise<boolean> {
  return Promise.resolve(confirm(message));
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
): Promise<boolean> {
  const userInput = prompt(
    `${message}\n\nPlease type "${confirmPhrase}" to confirm.`
  );
  return Promise.resolve(userInput === confirmPhrase);
}

/**
 * Reports a critical extension failure to the user and console.
 * Used when something catastrophic prevents the extension from functioning.
 *
 * @param msg The error message template. Use %name%, %version%, %url%, %author%, %description% for manifest placeholders.
 * @param err The error object that caused the failure
 */
export function reportExtensionFailure(msg: string, err: unknown): void {
  const message = replaceManifestPlaceholders(msg);
  const url = getManifest().data?.homepage_url || "[url unknown]";

  console.error(`${message} `, err);
  console.error(`To help fix this, please report the issue at: ${url}`);

  showNotification(
    `${message}\n\n` +
      `To help fix this, please report the issue at:\n` +
      `${url}\n\n` +
      `Thank you!`
  );
}
