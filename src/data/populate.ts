import { db } from "./db";
import { seedDatabase } from "./seed";

import { Extension } from "..";
import { IS_DEV } from "../constants/global";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_IN_PROGRESS_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../constants/settings";
import { DEFAULT_SYMBOL_RECORDS } from "../constants/symbols";
import { reportExtensionFailure } from "../utils/ui/dialogs";

export async function populateDb() {
  try {
    await db.readSettings.put(DEFAULT_READ_SETTINGS);
    await db.inProgressSettings.put(DEFAULT_IN_PROGRESS_SETTINGS);
    await db.ignoreSettings.put(DEFAULT_IGNORE_SETTINGS);
    await db.generalSettings.put(DEFAULT_GENERAL_SETTINGS);
    await db.symbolRecords.bulkPut(DEFAULT_SYMBOL_RECORDS);

    if (IS_DEV) await seedDatabase(); // test data for development
  } catch (err) {
    reportExtensionFailure(
      `⚠️ Failed to populate the database! ⚠️ The extension has been disabled.`,
      err
    );
    Extension.kill("Failed to populate the database");
  }
}
