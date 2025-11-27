import { db } from "./db";

import { WorksData } from "./works";
import { SettingsData } from "./settings";
import { SymbolsData } from "./symbols";

import { ReadWork, IgnoredWork } from "../types/works";
import {
  GeneralSettings,
  IgnoreSettings,
  ReadSettings,
} from "../types/settings";
import { SymbolRecord } from "../types/symbols";

import { SettingsType } from "../enums/settings";

export const ReadWorksData = new WorksData<ReadWork>(db.readWorks);
export const IgnoredWorksData = new WorksData<IgnoredWork>(db.ignoredWorks);

export const ReadSettingsData = new SettingsData<ReadSettings>(
  db.readSettings,
  SettingsType.READ
);
export const IgnoreSettingsData = new SettingsData<IgnoreSettings>(
  db.ignoreSettings,
  SettingsType.IGNORE
);
export const GeneralSettingsData = new SettingsData<GeneralSettings>(
  db.generalSettings,
  SettingsType.GENERAL
);

export const SymbolRecordsData = new SymbolsData<SymbolRecord>(
  db.symbolRecords
);
