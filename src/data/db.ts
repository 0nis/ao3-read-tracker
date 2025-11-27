import Dexie, { Table } from "dexie";
import {
  ReadSettings,
  IgnoreSettings,
  GeneralSettings,
  ReadWork,
  IgnoredWork,
  SymbolRecord,
} from "@types";
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
  DEFAULT_SYMBOL_RECORDS,
} from "@constants";
import { showNotification } from "@utils/ui";
import { createExtensionMsg } from "@utils/extension";

import { seedDatabase } from "./seed";

export class Ao3MarkAsReadDb extends Dexie {
  readWorks!: Table<ReadWork>;
  ignoredWorks!: Table<IgnoredWork>;
  readSettings!: Table<ReadSettings>;
  ignoreSettings!: Table<IgnoreSettings>;
  generalSettings!: Table<GeneralSettings>;
  symbolRecords!: Table<SymbolRecord>;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores({
      readWorks: "id, modifiedAt",
      ignoredWorks: "id, modifiedAt",
      readSettings: "id",
      ignoreSettings: "id",
      generalSettings: "id",
      symbolRecords: "id",
    });

    this.on("populate", async () => {
      await this.readSettings.put(DEFAULT_READ_SETTINGS);
      await this.ignoreSettings.put(DEFAULT_IGNORE_SETTINGS);
      await this.generalSettings.put(DEFAULT_GENERAL_SETTINGS);
      await this.symbolRecords.bulkPut(DEFAULT_SYMBOL_RECORDS);

      if (__DEV__) await seedDatabase(); // test data for development
    });

    this.on("blocked", () => {
      showNotification(
        createExtensionMsg(
          "Database upgrading was blocked by another window. " +
            "Please close down any other tabs or windows that has this page open"
        )
      );
    });
  }
}

export const db = new Ao3MarkAsReadDb();
