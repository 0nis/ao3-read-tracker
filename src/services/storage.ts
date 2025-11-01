import { LocalStorageAdapter } from "../adapters/localStorage.js";
import { ChromeLocalAdapter } from "../adapters/chrome/chromeLocal.js";
import { FirefoxLocalAdapter } from "../adapters/firefox/firefoxLocal.js";

import {
  ArrayKeys,
  StorageAdapter,
  StorageData,
  StorageEntryMap,
  StorageKey,
  StorageKeyMap,
} from "../types/storage";

import { VERSION } from "../constants/settings";
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
   * @param entry The entry to add
   */
  add: <K extends ArrayKeys>(key: K, entry: StorageEntryMap[K]) =>
    safeExecute(
      () => getStorageAdapter().add(key, entry),
      `Storage.add:${key}`
    ),

  /**
   * Removes an entry from the given key in storage.
   * @param key The key to remove the entry from
   * @param id The ID of the entry to remove
   */
  remove: <K extends ArrayKeys>(key: K, id: string) =>
    safeExecute(
      () => getStorageAdapter().remove(key, id),
      `Storage.remove:${key}`
    ),

  /**
   * Exports the given data as a JSON file.
   * @param data The data to export
   */
  async export(data: StorageData): Promise<void> {
    const exportData = {
      __ao3ReadTracker: true,
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
            imported.__ao3ReadTracker === true &&
            typeof imported.data === "object"
          ) {
            const { readFics, ignoredFics, settings } = imported.data;
            const currentAdapter = await getStorageAdapter();
            if (Array.isArray(readFics))
              await currentAdapter.set(STORAGE_KEYS.READ, readFics);
            if (Array.isArray(ignoredFics))
              await currentAdapter.set(STORAGE_KEYS.IGNORED, ignoredFics);
            await currentAdapter.set(STORAGE_KEYS.SETTINGS, settings);
            resolve(imported.data);
          } else {
            reject(
              new Error(
                "[AO3 Read Tracker] Invalid AO3 Read Tracker export file."
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
