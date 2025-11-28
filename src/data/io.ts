import "dexie-export-import";
import { ExportOptions, ImportOptions } from "dexie-export-import";

import { db } from "./db";
import { populateDb } from "./populate";

export const io = {
  export: async (options: ExportOptions): Promise<Blob> =>
    await db.export(options),

  import: async (blob: Blob, options?: ImportOptions) => {
    return await db.import(blob, options);
  },

  clear: async () => {
    for (const table of db.tables) {
      await table.clear();
    }
    await populateDb();
  },
};
