import { db } from "./db";
import {
  GeneralSettings,
  IgnoreSettings,
  ReadSettings,
} from "../types/settings";
import { ReadWork, IgnoredWork } from "../types/works";
import { BaseData } from "./works";
import { SettingsData } from "./settings";
import { SettingsType } from "../enums/settings";

export const ReadWorksData = new BaseData<ReadWork>(db.readWorks);
export const IgnoredWorksData = new BaseData<IgnoredWork>(db.ignoredWorks);

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
