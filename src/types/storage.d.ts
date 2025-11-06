export interface ReadFic {
  id: string;
  timestamp: number;
  title?: string;
}

export interface IgnoredFic {
  id: string;
  timestamp: number;
  title?: string;
  reason?: string;
}

export type StorageData = {
  readFics: Record<string, ReadFic>;
  ignoredFics: Record<string, IgnoredFic>;
  settings: Settings;
};

export type StorageResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: unknown };
