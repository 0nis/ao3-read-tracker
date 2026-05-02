import { start } from "./boot";
import { isAlive, setAlive } from "./state";

import { localMemory } from "../../services/memory";
import { addReloadButton } from "../../features/failsafe/recovery";

import { warn } from "../../shared/extension/logger";
import { showNotification } from "../../shared/extension/dialogs";
import { getFormattedDate } from "../../utils/date";
import { EXTENSION_DISABLED_KEY } from "../../constants/global";

/**
 * The logic executed when the extension must be disabled.
 * - Logs the reason for the extension being disabled
 * - Adds a reload button (since refreshing the page shouldn't re-enable it)
 * @param reason
 * @param disabledAt
 */
export async function disable(reason?: string, disabledAt?: number) {
  warn(
    `Extension was disabled${
      disabledAt ? ` at ${getFormattedDate(disabledAt)}` : ""
    }${
      reason ? ` for reason: ${reason}` : ""
    }. Skipping initialization. To attempt to re-enable the extension, click on the reload button located at the bottom of the page (in the footer).`,
  );
  addReloadButton(reload);
  setAlive(false);
}

/**
 * Attempts to re-enable the extension.
 * Clears the disabled flag and restarts initialization.
 */
export async function reload() {
  if (isAlive()) return;

  localMemory.delete(EXTENSION_DISABLED_KEY);
  setAlive(true);

  await start();

  if (isAlive()) showNotification("The extension was successfully re-enabled!");
}
