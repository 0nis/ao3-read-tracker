import { STORAGE_KEYS } from "../constants/settings";
import { Settings } from "./settings";

// --------------------------
// |       Core Types       |
// --------------------------

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface ReadFicInfo {
  timestamp: number;
  title?: string;
}
export type ReadFics = Record<string, ReadFicInfo>;

export interface IgnoredFicInfo {
  timestamp: number;
  title?: string;
  reason?: string;
}
export type IgnoredFics = Record<string, IgnoredFicInfo>;

// --------------------------------
// |       Storage Mappings       |
// --------------------------------

export interface StorageKeyMap {
  [STORAGE_KEYS.READ]: ReadFics;
  [STORAGE_KEYS.IGNORED]: IgnoredFics;
  [STORAGE_KEYS.SETTINGS]: Settings;
}

type StringKeyedRecord<T> = T extends { [key: string]: infer V } ? T : never;

export type RecordStorageMap = {
  [K in keyof StorageKeyMap as StringKeyedRecord<StorageKeyMap[K]> extends never
    ? never
    : K]: StringKeyedRecord<StorageKeyMap[K]>;
};

export type StorageData = {
  readFics: ReadFics;
  ignoredFics: IgnoredFics;
  settings: Settings;
};

export type StorageResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: unknown };

type RecordValue<T> = T extends Record<string, infer V> ? V : never;

// ---------------------------------
// |       Adapter Interface       |
// ---------------------------------

export interface StorageAdapter {
  get<K extends StorageKey>(key: K): Promise<StorageKeyMap[K] | null>;
  set<K extends StorageKey>(
    key: K,
    value: StorageKeyMap[K]
  ): Promise<void | null>;
}
