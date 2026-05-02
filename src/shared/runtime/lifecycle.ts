import { isAlive } from "./state";

import { db } from "../../data/db";
import { localMemory } from "../../services/memory";
import { warn } from "../../shared/extension/logger";
import { EXTENSION_DISABLED_KEY } from "../../constants/global";
import { CLASS_PREFIX } from "../../constants/classes";
import { ExtensionDisabledData } from "../../types/memory";
import { disable } from "./recovery";

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
export function kill(reason?: string) {
  if (!isAlive()) return;

  const disabledAt = Date.now();

  window.dispatchEvent(new Event("unload"));

  closeDb();
  cleanupDOM();

  warn(
    `${
      reason ? `${reason}. ` : ""
    }To avoid repeatedly showing error messages and disrupting your experience, the extension is temporarily disabled. AO3 will continue to function normally.`,
  );

  disable(reason, disabledAt);
  persistDisabledState(reason, disabledAt);
}

function closeDb() {
  try {
    db.close();
  } catch (err) {
    warn("Database already closed or failed during close:", err);
  }
}

function cleanupDOM() {
  document
    .querySelectorAll(`[class^="${CLASS_PREFIX}"]`)
    .forEach((el) => el.remove());
}

function persistDisabledState(reason?: string, disabledAt?: number) {
  try {
    localMemory.set<ExtensionDisabledData>(EXTENSION_DISABLED_KEY, {
      disabled: true,
      disabledAt,
      reason,
    });
  } catch (err) {
    warn("Failed to set extension disabled data:", err);
  }
}
