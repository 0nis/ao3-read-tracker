import { ExportOptions, ImportOptions } from "dexie-export-import";

import type { StorageResult } from "../types/results";
import type { WorkData } from "../types/works";
import { createSafeService, safeExecute } from "../utils/storage/safe";

import {
  IgnoredWorksData,
  ReadWorksData,
  ReadSettingsData,
  IgnoreSettingsData,
  GeneralSettingsData,
  SymbolRecordsData,
} from "../data/instances";
import { exportDb, importDb } from "../data/io";

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
  symbolRecords: createSafeService(
    "StorageService.symbolRecords",
    SymbolRecordsData
  ),

  async getByIds(ids: string[]): Promise<StorageResult<WorkData>> {
    return safeExecute(async () => {
      return {
        readWorks: await ReadWorksData.getByIds(ids),
        ignoredWorks: await IgnoredWorksData.getByIds(ids),
      };
    }, "StorageService.getByIds");
  },

  async export(options: ExportOptions): Promise<StorageResult<Blob>> {
    return safeExecute(() => exportDb(options), "StorageService.export");
  },

  async import(
    blob: Blob,
    dbVersionNr: number,
    options?: ImportOptions
  ): Promise<StorageResult<void>> {
    return safeExecute(
      () => importDb(blob, dbVersionNr, options),
      "StorageService.import"
    );
  },
};
