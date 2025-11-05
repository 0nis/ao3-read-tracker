import { STORAGE_KEYS } from "../constants/settings";
import { IgnoredFics, ReadFics } from "../types/storage";
import { Storage } from "./storage";

interface StoredData {
  read: ReadFics;
  ignored: IgnoredFics;
}

let cache: StoredData | null = null;

export async function getTrackedFics(): Promise<StoredData> {
  if (cache) return cache;

  const readRes = await Storage.get(STORAGE_KEYS.READ);
  const ignoredRes = await Storage.get(STORAGE_KEYS.IGNORED);

  if (!readRes.success || !ignoredRes.success)
    throw new Error("[AO3 Mark as Read] Failed to retrieve tracked fics");

  cache = {
    read: readRes.data || {},
    ignored: ignoredRes.data || {},
  };

  return cache;
}

export function isRead(id: string): boolean {
  return !!cache?.read[id];
}

export function isIgnored(id: string): boolean {
  return !!cache?.ignored[id];
}

export function invalidateCache() {
  cache = null;
}
