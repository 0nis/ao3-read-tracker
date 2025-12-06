import { db } from "./db";

import { WorksData } from "./models/works";
import { SettingsData } from "./models/settings";
import { SymbolsData } from "./models/symbols";

import { ReadWork, IgnoredWork, InProgressWork } from "../types/works";
import {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  ReadSettings,
} from "../types/settings";
import { SymbolRecord } from "../types/symbols";
import { SettingsType } from "../enums/settings";

export const instances = {
  readWorks: new WorksData<ReadWork>(db.readWorks),
  inProgressWorks: new WorksData<InProgressWork>(db.inProgressWorks),
  ignoredWorks: new WorksData<IgnoredWork>(db.ignoredWorks),

  readSettings: new SettingsData<ReadSettings>(
    db.readSettings,
    SettingsType.READ
  ),
  inProgressSettings: new SettingsData<InProgressSettings>(
    db.inProgressSettings,
    SettingsType.IN_PROGRESS
  ),
  ignoreSettings: new SettingsData<IgnoreSettings>(
    db.ignoreSettings,
    SettingsType.IGNORE
  ),
  generalSettings: new SettingsData<GeneralSettings>(
    db.generalSettings,
    SettingsType.GENERAL
  ),

  symbolRecords: new SymbolsData<SymbolRecord>(db.symbolRecords),
};

export type InstanceMap = typeof instances;
