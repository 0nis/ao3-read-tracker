import Dexie, { Table } from "dexie";

import { showNotification } from "../utils/ui/dialogs";
import { createExtensionMsg } from "../utils/extension";
import {
  ReadSettings,
  IgnoreSettings,
  GeneralSettings,
} from "../types/settings";
import { ReadWork, IgnoredWork, InProgressWork } from "../types/works";
import { SymbolRecord } from "../types/symbols";
import { DATABASE_NAME } from "../constants/global";
import { populateDb } from "./populate";

export class Ao3MarkAsReadDb extends Dexie {
  readWorks!: Table<ReadWork>;
  inProgressWorks!: Table<InProgressWork>;
  ignoredWorks!: Table<IgnoredWork>;
  readSettings!: Table<ReadSettings>;
  ignoreSettings!: Table<IgnoreSettings>;
  generalSettings!: Table<GeneralSettings>;
  symbolRecords!: Table<SymbolRecord>;

  constructor() {
    super(DATABASE_NAME);

    this.version(1).stores({
      readWorks: "id, finishedAt",
      inProgressWorks: "id, lastReadAt",
      ignoredWorks: "id, ignoredAt",
      readSettings: "id",
      ignoreSettings: "id",
      generalSettings: "id",
      symbolRecords: "id",
    });

    this.on("populate", async () => await populateDb());

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
