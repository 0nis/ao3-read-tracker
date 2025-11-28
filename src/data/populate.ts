import { db } from "./db";
import { seedDatabase } from "./seed";

import { IS_DEV } from "../constants/global";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../constants/settings";
import { DEFAULT_SYMBOL_RECORDS } from "../constants/symbols";

export async function populateDb() {
  await db.readSettings.put(DEFAULT_READ_SETTINGS);
  await db.ignoreSettings.put(DEFAULT_IGNORE_SETTINGS);
  await db.generalSettings.put(DEFAULT_GENERAL_SETTINGS);
  await db.symbolRecords.bulkPut(DEFAULT_SYMBOL_RECORDS);

  if (IS_DEV) await seedDatabase(); // test data for development
}
