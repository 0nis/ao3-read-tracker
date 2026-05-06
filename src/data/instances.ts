import { db } from "./db";

import { WorksData } from "./models/works";
import { SettingsData } from "./models/settings";
import { SymbolsData } from "./models/symbols";

import { FinishedWork, IgnoredWork, InProgressWork } from "../types/works";
import {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  FinishedSettings,
  SymbolSettings,
  DisplayModeSettings,
  LabelSettings,
} from "../types/settings";
import { SymbolRecord } from "../types/symbols";
import { SettingsType } from "../enums/settings";

export const instances = {
  finishedWorks: new WorksData<FinishedWork>(db.finishedWorks),
  inProgressWorks: new WorksData<InProgressWork>(db.inProgressWorks),
  ignoredWorks: new WorksData<IgnoredWork>(db.ignoredWorks),

  finishedSettings: new SettingsData<FinishedSettings>(
    db.finishedSettings,
    SettingsType.FINISHED,
  ),
  inProgressSettings: new SettingsData<InProgressSettings>(
    db.inProgressSettings,
    SettingsType.IN_PROGRESS,
  ),
  ignoreSettings: new SettingsData<IgnoreSettings>(
    db.ignoreSettings,
    SettingsType.IGNORE,
  ),
  generalSettings: new SettingsData<GeneralSettings>(
    db.generalSettings,
    SettingsType.GENERAL,
  ),
  displayModeSettings: new SettingsData<DisplayModeSettings>(
    db.displayModeSettings,
    SettingsType.DISPLAY_MODES,
  ),
  labelSettings: new SettingsData<LabelSettings>(
    db.labelSettings,
    SettingsType.LABELS,
  ),
  symbolSettings: new SettingsData<SymbolSettings>(
    db.symbolSettings,
    SettingsType.SYMBOLS,
  ),
  symbolRecords: new SymbolsData<SymbolRecord>(db.symbolRecords),
};

export type InstanceMap = typeof instances;
