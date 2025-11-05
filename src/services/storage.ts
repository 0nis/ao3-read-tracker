import { LocalStorageAdapter } from "../adapters/localStorage.js";
import { ChromeLocalAdapter } from "../adapters/chrome/chromeLocal.js";
import { FirefoxLocalAdapter } from "../adapters/firefox/firefoxLocal.js";

import {
  RecordStorageMap,
  StorageAdapter,
  StorageData,
  StorageKey,
  StorageKeyMap,
} from "../types/storage";

import { DEFAULT_SETTINGS, VERSION } from "../constants/settings";
import { STORAGE_KEYS } from "../constants/settings";
import { safeExecute } from "../utils/storage.js";

let adapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (adapter) return adapter;
  if (__STORAGE__ === "localStorage") return new LocalStorageAdapter();
  switch (__BROWSER__.toLowerCase()) {
    case "chrome":
      adapter = new ChromeLocalAdapter();
      break;
    case "firefox":
      adapter = new FirefoxLocalAdapter();
      break;
    default:
      adapter = new LocalStorageAdapter();
  }
  return adapter;
}

export const Storage = {
  /**
   * Retrieves the value for the given key from storage.
   * @param key The key to retrieve
   * @returns The value for the given key, or null if not found
   */
  get: <K extends StorageKey>(key: K) =>
    safeExecute(() => getStorageAdapter().get(key), `Storage.get:${key}`),

  /**
   * Saves the value for the given key to storage.
   * @param key The key to save
   * @param data The value to save
   */
  set: <K extends StorageKey>(key: K, data: StorageKeyMap[K]) =>
    safeExecute(() => getStorageAdapter().set(key, data), `Storage.set:${key}`),

  /**
   * Adds a new entry to the given key in storage.
   * @param key The key to add the entry to
   * @param id The ID of the entry to add
   * @param value The value of the entry to add
   * @returns A promise that resolves when the entry has been added
   */
  async add<K extends keyof RecordStorageMap>(
    key: K,
    id: string,
    value: RecordStorageMap[K][string]
  ) {
    return await safeExecute(async () => {
      const result =
        ((await getStorageAdapter().get(key)) as RecordStorageMap[K]) || {};
      result[id] = value;
      await this.set(key, result);
    }, `Storage.add:${key}`);
  },

  /**
   * Removes an entry from the given key in storage.
   * @param key The key to remove the entry from
   * @param id The ID of the entry to remove
   */
  async remove<K extends keyof RecordStorageMap>(key: K, id: string) {
    return await safeExecute(async () => {
      const result =
        ((await getStorageAdapter().get(key)) as RecordStorageMap[K]) || {};
      delete result[id];
      await this.set(key, result);
    }, `Storage.remove:${key}`);
  },

  /**
   * Exports the given data as a JSON file.
   * @param data The data to export
   */
  async export(): Promise<void> {
    const data: StorageData = {
      readFics: (await getStorageAdapter().get(STORAGE_KEYS.READ)) || {},
      ignoredFics: (await getStorageAdapter().get(STORAGE_KEYS.IGNORED)) || {},
      settings:
        (await getStorageAdapter().get(STORAGE_KEYS.SETTINGS)) ||
        DEFAULT_SETTINGS,
    };

    const exportData = {
      __ao3MarkAsRead: true,
      version: VERSION,
      exportedAt: new Date().toISOString(),
      data: data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `ao3-read-tracker_export_${dateStr}.json`;
    a.click();

    URL.revokeObjectURL(url);
  },

  async import(file: File): Promise<StorageData> {
    return new Promise<StorageData>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);

          if (
            typeof imported === "object" &&
            imported !== null &&
            imported.__ao3MarkAsRead === true &&
            typeof imported.data === "object"
          ) {
            const { readFics, ignoredFics, settings } = imported.data;
            const currentAdapter = getStorageAdapter();
            if (readFics && typeof readFics === "object")
              await currentAdapter.set(STORAGE_KEYS.READ, readFics);
            if (ignoredFics && typeof ignoredFics === "object")
              await currentAdapter.set(STORAGE_KEYS.IGNORED, ignoredFics);
            await currentAdapter.set(STORAGE_KEYS.SETTINGS, settings);
            resolve(imported.data);
          } else {
            reject(
              new Error(
                "[AO3 Mark as Read] Invalid AO3 Mark as Read export file."
              )
            );
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },
};
