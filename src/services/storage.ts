import type { StorageResult } from "../types/results";
import type { WorkData } from "../types/works";
import {
  IgnoredWorksData,
  ReadWorksData,
  ReadSettingsData,
  IgnoreSettingsData,
  GeneralSettingsData,
} from "../data/data";
import { createSafeService, safeExecute } from "../utils/storage/safe";

export const StorageService = {
  readWorks: createSafeService("StorageService.readWorks", ReadWorksData),
  ignoredWorks: createSafeService(
    "StorageService.ignoredWorks",
    IgnoredWorksData
  ),
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

  async getByIds(ids: string[]): Promise<StorageResult<WorkData>> {
    return safeExecute(async () => {
      return {
        readWorks: await ReadWorksData.getByIds(ids),
        ignoredWorks: await IgnoredWorksData.getByIds(ids),
      };
    }, "StorageService.getByIds");
  },

  async export(): Promise<void> {
    // TODO: Implement
  },

  async import(file: File): Promise<StorageResult<WorkData>> {
    // TODO: Implement
    return {
      success: false,
      error: "Import functionality is not implemented yet.",
    };
  },
};
