import Dexie, { Table } from "dexie";
import {
  ReadFic,
  IgnoredFic,
  ReadSettings,
  IgnoreSettings,
  GeneralSettings,
} from "../types/storage";
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../constants/settings";

export class Ao3MarkAsReadDb extends Dexie {
  readFics!: Table<ReadFic>;
  ignoredFics!: Table<IgnoredFic>;
  readSettings!: Table<ReadSettings>;
  ignoreSettings!: Table<IgnoreSettings>;
  generalSettings!: Table<GeneralSettings>;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores({
      readFics: "id",
      ignoredFics: "id",
      readSettings: "id",
      ignoreSettings: "id",
      generalSettings: "id",
    });

    this.on("populate", async () => {
      await this.readSettings.put(DEFAULT_READ_SETTINGS);
      await this.ignoreSettings.put(DEFAULT_IGNORE_SETTINGS);
      await this.generalSettings.put(DEFAULT_GENERAL_SETTINGS);
    });
  }
}

export const db = new Ao3MarkAsReadDb();
