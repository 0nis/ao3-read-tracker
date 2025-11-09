import { db } from "./db";
import { IgnoredFic, ReadFic, Settings } from "../types/storage";
import { BaseData } from "./base";

export const ReadFicsData = new BaseData<ReadFic>(db.readFics);
export const IgnoredFicsData = new BaseData<IgnoredFic>(db.ignoredFics);
export const SettingsData = new BaseData<Settings>(db.settings);
