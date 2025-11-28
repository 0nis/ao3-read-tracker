import { ICache } from "./cache.interface";
import { SymbolData } from "../../types/symbols";
import { handleStorageRead } from "../../utils/storage/handlers";
import { StorageService } from "../storage";
import { DEFAULT_SYMBOL_RECORDS } from "../../constants/symbols";

export class SymbolsCache implements ICache<SymbolData> {
  private cache: SymbolData | null = null;

  async get(): Promise<SymbolData> {
    if (this.cache) return this.cache;

    const defaultData = Object.fromEntries(
      DEFAULT_SYMBOL_RECORDS.map((r) => [r.id, r])
    );

    this.cache = (await handleStorageRead(StorageService.symbolRecords.get(), {
      errorMsg: "Failed to load symbol records",
      fallback: defaultData,
    })) as SymbolData;

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
