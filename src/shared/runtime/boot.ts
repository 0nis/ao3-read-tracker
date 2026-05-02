import { isAlive } from "./state";
import { disable } from "./recovery";
import { kill } from "./lifecycle";

import { App } from "../../app";
import { db } from "../../data/db";
import { localMemory } from "../../services/memory";
import { reportExtensionFailure } from "../../shared/extension/dialogs";
import { ExtensionDisabledData } from "../../types/memory";
import { EXTENSION_DISABLED_KEY } from "../../constants/global";

export async function boot() {
  const res = localMemory.get<ExtensionDisabledData>(EXTENSION_DISABLED_KEY);
  if (res?.disabled) {
    disable(res.reason, res.disabledAt);
    return;
  }
  await start();
}

/**
 * Opens the database connection and starts the extension
 * - If the database fails to open, the extension will be disabled
 * - If the extension was previously disabled, the extension will re-disable
 */
export async function start() {
  if (!isAlive()) return;
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
