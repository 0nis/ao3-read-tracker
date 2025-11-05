import {
  StorageAdapter,
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
}
