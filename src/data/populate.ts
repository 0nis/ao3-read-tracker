import { db } from "./db";
import { seedDatabase } from "./seed";

import { ExtensionRuntime } from "../shared/runtime";

import { reportExtensionFailure } from "../shared/extension/dialogs";
import { IS_DEV } from "../constants/global";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_IN_PROGRESS_SETTINGS,
  DEFAULT_FINISHED_SETTINGS,
  DEFAULT_SYMBOL_SETTINGS,
  DEFAULT_DISPLAYMODE_SETTINGS,
} from "../constants/settings";
import { DEFAULT_SYMBOL_RECORDS } from "../constants/symbols";

export async function populateDb() {
  try {
    await db.finishedSettings.put(DEFAULT_FINISHED_SETTINGS);
    await db.inProgressSettings.put(DEFAULT_IN_PROGRESS_SETTINGS);
    await db.ignoreSettings.put(DEFAULT_IGNORE_SETTINGS);
    await db.generalSettings.put(DEFAULT_GENERAL_SETTINGS);
    await db.displayModeSettings.put(DEFAULT_DISPLAYMODE_SETTINGS);
    await db.symbolSettings.put(DEFAULT_SYMBOL_SETTINGS);
    await db.symbolRecords.bulkPut(DEFAULT_SYMBOL_RECORDS);

    if (IS_DEV) await seedDatabase(); // test data for development
  } catch (err) {
    reportExtensionFailure(
      `⚠️ Failed to populate the database! ⚠️ The extension has been disabled.`,
      err,
    );
    ExtensionRuntime.kill("Failed to populate the database");
  }
}
