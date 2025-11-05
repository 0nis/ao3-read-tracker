import {
  StorageAdapter,
  StorageKey,
  StorageKeyMap,
} from "../../types/storage.js";

export class FirefoxLocalAdapter implements StorageAdapter {
  async get<K extends StorageKey>(key: K): Promise<StorageKeyMap[K] | null> {
    const result = await browser.storage.local.get(key);
    return result[key] || {};
  }

  async set<K extends StorageKey>(
    key: K,
    value: StorageKeyMap[K]
  ): Promise<void | null> {
    await browser.storage.local.set({ [key]: value });
  }
}
