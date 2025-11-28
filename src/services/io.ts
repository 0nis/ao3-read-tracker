import { ExportOptions, ImportOptions } from "dexie-export-import";
import { io } from "../data/io";
import { StorageResult } from "../types/results";
import { safeExecute } from "../utils/storage/safe";

export const IoService = {
  async export(options: ExportOptions): Promise<StorageResult<Blob>> {
    return safeExecute(
      () => io.exportDatabase(options),
      "StorageService.export"
    );
  },

  async import(
    blob: Blob,
    dbVersionNr: number,
    options?: ImportOptions
  ): Promise<StorageResult<void>> {
    return safeExecute(
      () => io.importDatabase(blob, dbVersionNr, options),
      "StorageService.import"
    );
  },
};
