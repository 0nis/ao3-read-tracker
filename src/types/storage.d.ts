import { STORAGE_KEYS } from "../constants/settings";
import { Settings } from "./settings";

// --------------------------
// |       Core Types       |
// --------------------------

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type ReadFicsEntry = {
  id: string;
  timestamp: number;
  title?: string;
};
export type ReadFics = ReadFicsEntry[];

export type IgnoredFicsEntry = {
  id: string;
  timestamp: number;
  title?: string;
  reason?: string;
};
export type IgnoredFics = IgnoredFicsEntry[];

// --------------------------------
// |       Storage Mappings       |
// --------------------------------

export interface StorageKeyMap {
  [STORAGE_KEYS.READ]: ReadFics;
  [STORAGE_KEYS.IGNORED]: IgnoredFics;
  [STORAGE_KEYS.SETTINGS]: Settings;
}

export type StorageEntryMap = {
  [K in keyof StorageKeyMap]: StorageKeyMap[K] extends (infer U)[] ? U : never;
};

export type ArrayKeys = {
  [K in keyof StorageKeyMap]: StorageKeyMap[K] extends any[] ? K : never;
}[keyof StorageKeyMap];

export type StorageData = {
  readFics: ReadFics;
  ignoredFics: IgnoredFics;
  settings: Settings;
};

export type StorageResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: unknown };

// ---------------------------------
// |       Adapter Interface       |
// ---------------------------------

export interface StorageAdapter {
  get<K extends StorageKey>(key: K): Promise<StorageKeyMap[K] | null>;
  set<K extends StorageKey>(
    key: K,
    value: StorageKeyMap[K]
  ): Promise<void | null>;
  add<K extends ArrayKeys>(
    key: K,
    value: StorageEntryMap[K]
  ): Promise<void | null>;
  remove<K extends ArrayKeys>(key: K, id: string): Promise<void | null>;
}
