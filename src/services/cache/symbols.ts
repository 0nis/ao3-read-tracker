import { AsyncCache } from "./abstract";
import { StorageService } from "../storage";

import { handleStorageRead } from "../../utils/storage";
import { DEFAULT_SYMBOL_RECORDS } from "../../constants/symbols";
import { SymbolData } from "../../types/symbols";

export class SymbolsCache extends AsyncCache<SymbolData> {
  protected async load(): Promise<SymbolData> {
    const defaultData = Object.fromEntries(
      DEFAULT_SYMBOL_RECORDS.map((r) => [r.id, r])
    );

    return (await handleStorageRead(StorageService.symbolRecords.get(), {
      errorMsg: "Failed to load symbol records",
      fallback: defaultData,
      errorOnEmpty: true,
      errorOnUndefined: true,
    })) as SymbolData;
  }
}

export const symbolsCache = new SymbolsCache();
