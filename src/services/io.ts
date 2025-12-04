import { ExportOptions, ImportOptions } from "dexie-export-import";
import { io } from "../data/io";
import { migrations } from "../data/migrations";

import { StorageResult } from "../types/results";
import { safeExecute } from "../utils/storage";
import { DATABASE_VERSION } from "../constants/global";

export const IoService = {
  async export(options: ExportOptions): Promise<StorageResult<Blob>> {
    return safeExecute(() => io.export(options), "StorageService.export");
  },

  async import(
    blob: Blob,
    options?: ImportOptions
  ): Promise<StorageResult<void>> {
    return safeExecute(() => io.import(blob, options), "StorageService.import");
  },

  async clear(): Promise<StorageResult<void>> {
    return safeExecute(() => io.clear(), "StorageService.clear");
  },

  // TODO: Test
  // When I actually have migrations to test with...
  getMigrationTransformFunc(dbVersionNr: number): ImportOptions["transform"] {
    return (tableName: string, value: any, key?: any) => {
      let migratedValue = value;
      for (let v = dbVersionNr; v < DATABASE_VERSION; v++) {
        const migrationFns = migrations[v];
        if (migrationFns) {
          for (const fn of migrationFns) {
            migratedValue = fn(migratedValue, tableName);
          }
        }
      }
      return {
        value: migratedValue,
        key,
      };
    };
  },
};
