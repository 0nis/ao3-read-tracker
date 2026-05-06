import Dexie, { Table } from "dexie";

import { populateDb } from "./populate";

import { createExtensionMsg } from "../shared/extension/logger";
import { showNotification } from "../shared/extension/dialogs";
import {
  FinishedSettings,
  IgnoreSettings,
  GeneralSettings,
  InProgressSettings,
  SymbolSettings,
  DisplayModeSettings,
  LabelSettings,
} from "../types/settings";
import { FinishedWork, IgnoredWork, InProgressWork } from "../types/works";
import { SymbolRecord } from "../types/symbols";
import { DATABASE_NAME } from "../constants/global";

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
  displayModeSettings!: Table<DisplayModeSettings>;
  labelSettings!: Table<LabelSettings>;

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
      displayModeSettings: "id",
      labelSettings: "id",
    });

    this.on("populate", async () => await populateDb());

    this.on("blocked", () => {
      showNotification(
        createExtensionMsg(
          "Database upgrading was blocked by another window. " +
            "Please close down any other tabs or windows that has this page open",
        ),
      );
    });
  }
}

export const db = new Ao3ReadTrackerDb();
