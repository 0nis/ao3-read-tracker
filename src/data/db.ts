import Dexie, { Table } from "dexie";
import { ReadFic, IgnoredFic, Settings } from "../types/storage";
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../constants/settings";

export class Ao3MarkAsReadDb extends Dexie {
  readFics!: Table<ReadFic>;
  ignoredFics!: Table<IgnoredFic>;
  settings!: Table<Settings>;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores({
      readFics: "id",
      ignoredFics: "id",
      settings: "id",
    });

    this.on("populate", async () => {
      this.settings.bulkAdd([DEFAULT_READ_SETTINGS, DEFAULT_IGNORE_SETTINGS]);
    });
  }
}

export const db = new Ao3MarkAsReadDb();
