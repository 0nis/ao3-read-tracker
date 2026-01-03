import Dexie, { Table } from "dexie";

import { showNotification } from "../utils/ui/dialogs";
import { createExtensionMsg } from "../utils/extension";
import {
  FinishedSettings,
  IgnoreSettings,
  GeneralSettings,
  InProgressSettings,
  SymbolSettings,
} from "../types/settings";
import { FinishedWork, IgnoredWork, InProgressWork } from "../types/works";
import { SymbolRecord } from "../types/symbols";
import { DATABASE_NAME } from "../constants/global";
import { populateDb } from "./populate";

export class Ao3ReadTrackerDb extends Dexie {
  finishedWorks!: Table<FinishedWork>;
  inProgressWorks!: Table<InProgressWork>;
  ignoredWorks!: Table<IgnoredWork>;
  finishedSettings!: Table<FinishedSettings>;
  inProgressSettings!: Table<InProgressSettings>;
  ignoreSettings!: Table<IgnoreSettings>;
  generalSettings!: Table<GeneralSettings>;
  symbolSettings!: Table<SymbolSettings>;
  symbolRecords!: Table<SymbolRecord>;

  constructor() {
    super(DATABASE_NAME);

    this.version(1).stores({
      finishedWorks: "id, finishedAt, timesRead",
      inProgressWorks: "id, lastReadAt, startedAt",
      ignoredWorks: "id, ignoredAt",
      finishedSettings: "id",
      inProgressSettings: "id",
      ignoreSettings: "id",
      generalSettings: "id",
      symbolSettings: "id",
      symbolRecords: "id, priority",
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

export const db = new Ao3ReadTrackerDb();
