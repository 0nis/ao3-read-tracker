import { db } from "./db";
import {
  GeneralSettings,
  IgnoredFic,
  IgnoreSettings,
  ReadFic,
  ReadSettings,
} from "../types/storage";
import { BaseData } from "./base";
import { SettingsData } from "./settings";
import { SettingsType } from "../constants/enums";

export const ReadFicsData = new BaseData<ReadFic>(db.readFics);
export const IgnoredFicsData = new BaseData<IgnoredFic>(db.ignoredFics);

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
