import type { FicData, StorageResult } from "../types/storage";
import {
  IgnoredFicsData,
  ReadFicsData,
  ReadSettingsData,
  IgnoreSettingsData,
  GeneralSettingsData,
} from "../data/data";
import { createSafeService, safeExecute } from "../utils/storage/safe";

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

  async getByIds(ids: string[]): Promise<StorageResult<FicData>> {
    return safeExecute(async () => {
      return {
        readFics: await ReadFicsData.getByIds(ids),
        ignoredFics: await IgnoredFicsData.getByIds(ids),
      };
    }, "StorageService.getByIds");
  },

  async export(): Promise<void> {
    // TODO: Implement
  },

  async import(file: File): Promise<StorageResult<FicData>> {
    // TODO: Implement
    return {
      success: false,
      error: "Import functionality is not implemented yet.",
    };
  },
};
