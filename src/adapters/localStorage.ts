import { safeExecute } from "../utils/storage";

import {
  ArrayKeys,
  StorageAdapter,
  StorageEntryMap,
  StorageKey,
  StorageKeyMap,
} from "../types/storage";

export class LocalStorageAdapter implements StorageAdapter {
  async get<K extends StorageKey>(key: K): Promise<StorageKeyMap[K] | null> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async set<K extends StorageKey>(
    key: K,
    value: StorageKeyMap[K]
  ): Promise<void | null> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async add<K extends ArrayKeys>(
    key: K,
    value: StorageEntryMap[K]
  ): Promise<void | null> {
    const current = JSON.parse(
      localStorage.getItem(key) || "[]"
    ) as StorageKeyMap[K][];
    current.push(value as any);
    await this.set(key, current as unknown as StorageKeyMap[K]);
    return;
  }

  async remove<K extends ArrayKeys>(key: K, id: string): Promise<void | null> {
    const current = JSON.parse(
      localStorage.getItem(key) || "[]"
    ) as StorageKeyMap[K];
    const updated = (current as any[]).filter((entry) => entry.id !== id);
    await this.set(key, updated);
    return;
  }
}
