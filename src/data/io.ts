import "dexie-export-import";
import { ExportOptions, ImportOptions } from "dexie-export-import";

import { db } from "./db";
import { DATABASE_VERSION } from "../constants/global";

export const io = {
  exportDatabase: async (options: ExportOptions): Promise<Blob> =>
    await db.export(options),

  importDatabase: async (
    blob: Blob,
    dbVersionNr: number,
    options?: ImportOptions
  ) => {
    if (dbVersionNr !== DATABASE_VERSION) {
      throw new Error(
        "Database version mismatch: conversion not implemented yet."
      );
      const convertedBlob = await convertDbVersion(blob, dbVersionNr, options);
      await db.import(convertedBlob, options);
    } else await db.import(blob, options);
  },
};

async function convertDbVersion(
  blob: Blob,
  dbVersionNr: number,
  options?: ImportOptions
) {
  return blob;
}
