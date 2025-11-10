import { db } from "../data/db";
import { VERSION } from "../constants/settings";
import type {
  IgnoredFic,
  ReadFic,
  Settings,
  StorageData,
  StorageResult,
} from "../types/storage";
import { IgnoredFicsData, ReadFicsData, SettingsData } from "../data/data";
import { createSafeService, safeExecute } from "../utils/storage";
import { readFileAsText } from "../utils/file";

export const StorageService = {
  readFics: createSafeService("StorageService.readFics", ReadFicsData),
  ignoredFics: createSafeService("StorageService.ignoredFics", IgnoredFicsData),
  settings: createSafeService("StorageService.settings", SettingsData),

  async getAll(): Promise<StorageResult<StorageData>> {
    return safeExecute(async () => {
      return {
        readFics: await ReadFicsData.get(),
        ignoredFics: await IgnoredFicsData.get(),
        settings: await SettingsData.get(),
      };
    }, "StorageService.getAll");
  },

  async getByIds(
    ids: string[]
  ): Promise<StorageResult<Pick<StorageData, "readFics" | "ignoredFics">>> {
    return safeExecute(async () => {
      return {
        readFics: await ReadFicsData.getByIds(ids),
        ignoredFics: await IgnoredFicsData.getByIds(ids),
      };
    }, "StorageService.getByIds");
  },

  async export(): Promise<void> {
    const data = await this.getAll();
    const exportData = {
      __ao3MarkAsRead: true,
      version: VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ao3-read-tracker_export_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async import(file: File): Promise<StorageResult<StorageData>> {
    return safeExecute(async () => {
      const text = await readFileAsText(file);
      const imported = JSON.parse(text);

      if (!imported?.__ao3MarkAsRead || typeof imported.data !== "object")
        throw new Error("Invalid AO3 Mark as Read export file.");

      const { readFics, ignoredFics, settings } = imported.data;
      await ReadFicsData.replaceAll(readFics as ReadFic[]);
      await IgnoredFicsData.replaceAll(ignoredFics as IgnoredFic[]);
      await SettingsData.replaceAll(settings as Settings[]);

      return imported.data as StorageData;
    }, "StorageService.import");
  },
};
