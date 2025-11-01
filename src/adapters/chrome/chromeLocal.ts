import { safeExecute } from "../../utils/storage.js";
import {
  ArrayKeys,
  StorageAdapter,
  StorageEntryMap,
  StorageKey,
  StorageKeyMap,
} from "../../types/storage.js";

export class ChromeLocalAdapter implements StorageAdapter {
  async get<K extends StorageKey>(key: K): Promise<StorageKeyMap[K] | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) throw chrome.runtime.lastError;
        resolve(result[key] || {});
      });
    });
  }

  async set<K extends StorageKey>(
    key: K,
    value: StorageKeyMap[K]
  ): Promise<void | null> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) throw chrome.runtime.lastError;
        resolve();
      });
    });
  }

  async add<K extends ArrayKeys>(
    key: K,
    value: StorageEntryMap[K]
  ): Promise<void | null> {
    const result = await chrome.storage.local.get([key]);
    const current = (result[key] || []) as StorageKeyMap[K][];
    current.push(value as any);
    await this.set(key, current as unknown as StorageKeyMap[K]);
    return;
  }

  async remove<K extends ArrayKeys>(key: K, id: string): Promise<void | null> {
    const result = await chrome.storage.local.get([key]);
    const current = (result[key] || []) as StorageKeyMap[K];
    const updated = (current as any[]).filter((entry) => entry.id !== id);
    await this.set(key, updated as unknown as StorageKeyMap[K]);
    return;
  }
}
