import { db } from "./db";

import { WorksData, SettingsData, SymbolsData } from "./models";

import {
  GeneralSettings,
  IgnoreSettings,
  ReadSettings,
  ReadWork,
  IgnoredWork,
  SymbolRecord,
} from "@types";

import { SettingsType } from "@enums";

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
