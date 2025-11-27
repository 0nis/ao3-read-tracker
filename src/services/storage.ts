import type { StorageResult, WorkData } from "@types";
import {
  IgnoredWorksData,
  ReadWorksData,
  ReadSettingsData,
  IgnoreSettingsData,
  GeneralSettingsData,
  SymbolRecordsData,
} from "@data";
import { createSafeService, safeExecute } from "@utils/storage";

export const StorageService = {
  get readWorks() {
    return createSafeService("StorageService.readWorks", ReadWorksData);
  },
  get ignoredWorks() {
    return createSafeService("StorageService.ignoredWorks", IgnoredWorksData);
  },
  get readSettings() {
    return createSafeService("StorageService.readSettings", ReadSettingsData);
  },
  get ignoreSettings() {
    return createSafeService(
      "StorageService.ignoreSettings",
      IgnoreSettingsData
    );
  },
  get generalSettings() {
    return createSafeService(
      "StorageService.generalSettings",
      GeneralSettingsData
    );
  },
  get symbolRecords() {
    return createSafeService("StorageService.symbolRecords", SymbolRecordsData);
  },

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
