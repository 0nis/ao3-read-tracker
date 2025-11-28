import "dexie-export-import";
import { ExportOptions, ImportOptions } from "dexie-export-import";

import { db } from "./db";

export const io = {
  export: async (options: ExportOptions): Promise<Blob> =>
    await db.export(options),

  import: async (blob: Blob, options?: ImportOptions) => {
    return await db.import(blob, options);
  },
};
