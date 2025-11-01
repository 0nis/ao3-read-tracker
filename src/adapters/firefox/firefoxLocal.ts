import { safeExecute } from "../../utils/storage.js";
import {
  ArrayKeys,
  StorageAdapter,
  StorageEntryMap,
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

  async add<K extends ArrayKeys>(
    key: K,
    value: StorageEntryMap[K]
  ): Promise<void | null> {
    const result = await browser.storage.local.get(key);
    const current = (result[key] || []) as StorageKeyMap[K][];
    current.push(value as any);
    await this.set(key, current as unknown as StorageKeyMap[K]);
    return;
  }

  async remove<K extends ArrayKeys>(key: K, id: string): Promise<void | null> {
    const result = await browser.storage.local.get(key);
    const current = (result[key] || []) as StorageKeyMap[K];
    const updated = (current as any[]).filter((entry) => entry.id !== id);
    await this.set(key, updated as unknown as StorageKeyMap[K]);
    return;
  }
}
