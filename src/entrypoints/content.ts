import { App } from "../app";
import { db } from "../data/db";
import { localMemory } from "../services/memory";

import { getFormattedDate } from "../utils/date";
import { reportExtensionFailure, showNotification } from "../utils/ui/dialogs";
import { warn } from "../utils/extension";
import { addReloadButton } from "../utils/ui/footer";
import { EXTENSION_DISABLED_KEY } from "../constants/global";
import { CLASS_PREFIX } from "../constants/classes";
import { ExtensionDisabledData } from "../types/memory";

let extensionAlive = true;

/**
 * Opens the database connection and starts the extension
 * - If the database fails to open, the extension will be disabled
 * - If the extension was previously disabled, the extension will re-disable
 */
async function start() {
  if (!extensionAlive) return;
  try {
    await db.open();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ Extension %name% (v%version%) failed to start! ⚠️",
      err,
    );
    kill("Database failed to open");
    return;
  }
  try {
    await App.init();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ An unknown error occurred in extension %name% (v%version%)! The extension may not work as expected. ⚠️",
      err,
    );
    return;
  }
}

/**
 * Attempts to re-enable the extension.
 * Clears the disabled flag and restarts initialization.
 */
async function reload() {
  if (extensionAlive) return;

  localMemory.delete(EXTENSION_DISABLED_KEY);
  extensionAlive = true;

  await start();

  if (extensionAlive)
    showNotification("The extension was successfully re-enabled!");
}

/**
 * Fully disables the extension.
 * Only to be used in case of a critical error that may prevent AO3 from working properly.
 * - Closes the database connection
 * - Removes all elements created by the extension
 * - Cleans up global event listeners
 *
 * Persists the extension disabled data in local storage to prevent it from spamming the
 * user with errors every time they navigate to a new page (since the extension reloads)
 *
 * @param reason The reason for the extension being disabled
 */
function kill(reason?: string) {
  if (!extensionAlive) return;

  extensionAlive = false;

  try {
    db.close();
  } catch (err) {
    warn("Database already closed or failed during close:", err);
  }
  window.dispatchEvent(new Event("unload"));

  document
    .querySelectorAll(`[class^="${CLASS_PREFIX}"]`)
    .forEach((el) => el.remove());

  try {
    localMemory.set<ExtensionDisabledData>(EXTENSION_DISABLED_KEY, {
      disabled: true,
      reason,
      disabledAt: Date.now(),
    });
  } catch (err) {
    warn("Failed to set extension disabled data:", err);
  }

  warn(
    `${
      reason ? `${reason}. ` : ""
    }To avoid repeatedly showing error messages and disrupting your experience, the extension is temporarily disabled. AO3 will continue to function normally.`,
  );
}

/**
 * The logic executed when the extension must be disabled.
 * - Logs the reason for the extension being disabled
 * - Adds a reload button (since refreshing the page shouldn't re-enable it)
 * @param reason
 * @param disabledAt
 */
async function disable(reason?: string, disabledAt?: number) {
  warn(
    `Extension was disabled${
      disabledAt ? ` at ${getFormattedDate(disabledAt)}` : ""
    }${
      reason ? ` for reason: ${reason}` : ""
    }. Skipping initialization. To attempt to re-enable the extension, click on the reload button located at the bottom of the page (in the footer).`,
  );
  addReloadButton(reload);
  extensionAlive = false;
}

export const Extension = {
  reload,
  kill,
  isAlive: () => extensionAlive,
};

(async function main() {
  const res = localMemory.get<ExtensionDisabledData>(EXTENSION_DISABLED_KEY);
  if (res?.disabled) {
    disable(res.reason, res.disabledAt);
    return;
  }
  await start();
})();
