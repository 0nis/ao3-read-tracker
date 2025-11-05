import { StorageAdapter, StorageKey, StorageKeyMap } from "../types/storage";

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
}
