import { SymbolData } from "@types";
import { handleStorageRead } from "@utils/storage";
import { DEFAULT_SYMBOL_RECORDS } from "@constants";

import { ICache } from "./cache.interface";
import { StorageService } from "../storage";

export class SymbolsCache implements ICache<SymbolData> {
  private cache: SymbolData | null = null;

  async get(): Promise<SymbolData> {
    if (this.cache) return this.cache;

    const defaultData = Object.fromEntries(
      DEFAULT_SYMBOL_RECORDS.map((r) => [r.id, r])
    );

    this.cache = (await handleStorageRead(
      StorageService.symbolRecords.get(),
      defaultData,
      "Failed to load symbol records"
    )) as SymbolData;

    return this.cache;
  }

  update(value: SymbolData): void {
    this.cache = value;
  }

  clear(): void {
    this.cache = null;
  }
}

export const symbolsCache = new SymbolsCache();
