import Dexie, { Table } from "dexie";
import { ReadFic, IgnoredFic } from "../types/storage";
import { DATABASE_NAME, DATABASE_VERSION } from "../constants/settings";
import { Settings } from "../types/settings";

export class Ao3MarkAsReadDb extends Dexie {
  readFics!: Table<ReadFic>;
  ignoredFics!: Table<IgnoredFic>;
  settings!: Table<{ id: string; data: Settings }>;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores({
      readFics: "id",
      ignoredFics: "id",
      settings: "id",
    });
  }
}

export const db = new Ao3MarkAsReadDb();
