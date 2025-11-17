import { db } from "../data/db";
import { VERSION } from "../constants/settings";
import type { FicData, SettingsData, StorageResult } from "../types/storage";
import {
  IgnoredFicsData,
  ReadFicsData,
  ReadSettingsData,
  IgnoreSettingsData,
  GeneralSettingsData,
} from "../data/data";
import { createSafeService, safeExecute } from "../utils/storage";
import { getSettings } from "../ui/settings/handlers";

export const StorageService = {
  readFics: createSafeService("StorageService.readFics", ReadFicsData),
  ignoredFics: createSafeService("StorageService.ignoredFics", IgnoredFicsData),
  readSettings: createSafeService(
    "StorageService.readSettings",
    ReadSettingsData
  ),
  ignoreSettings: createSafeService(
    "StorageService.ignoreSettings",
    IgnoreSettingsData
  ),
  generalSettings: createSafeService(
    "StorageService.generalSettings",
    GeneralSettingsData
  ),

  async getAllSettings(): Promise<StorageResult<Partial<SettingsData>>> {
    return safeExecute(async () => {
      return {
        readSettings: await ReadSettingsData.get(),
        ignoreSettings: await IgnoreSettingsData.get(),
        generalSettings: await GeneralSettingsData.get(),
      };
    }, "StorageService.getAllSettings");
  },

  async getByIds(ids: string[]): Promise<StorageResult<FicData>> {
    return safeExecute(async () => {
      return {
        readFics: await ReadFicsData.getByIds(ids),
        ignoredFics: await IgnoredFicsData.getByIds(ids),
      };
    }, "StorageService.getByIds");
  },

  async export(): Promise<void> {
    // const data = await this.getAll();
    // const exportData = {
    //   __ao3MarkAsRead: true,
    //   version: VERSION,
    //   exportedAt: new Date().toISOString(),
    //   data,
    // };
    // const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    //   type: "application/json",
    // });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `ao3-read-tracker_export_${
    //   new Date().toISOString().split("T")[0]
    // }.json`;
    // a.click();
    // URL.revokeObjectURL(url);
  },

  async import(file: File): Promise<StorageResult<FicData>> {
    // return safeExecute(async () => {
    //   const text = await readFileAsText(file);
    //   const imported = JSON.parse(text);

    //   if (!imported?.__ao3MarkAsRead || typeof imported.data !== "object")
    //     throw new Error("Invalid AO3 Mark as Read export file.");

    //   const { readFics, ignoredFics, settings } = imported.data;
    //   await ReadFicsData.replaceAll(readFics as ReadFic[]);
    //   await IgnoredFicsData.replaceAll(ignoredFics as IgnoredFic[]);
    //   await SettingsData.replaceAll(settings as Settings[]);

    //   return imported.data as StorageData;
    // }, "StorageService.import");
    return {
      success: false,
      error: "Import functionality is not implemented yet.",
    };
  },
};
