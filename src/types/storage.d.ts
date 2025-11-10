import { COLLAPSE_MODE } from "../constants/settings";

export interface ReadFic {
  id: string;
  timestamp: number;
  title?: string;
  reread?: boolean;
  count?: number;
  notes?: string;
}

export interface IgnoredFic {
  id: string;
  timestamp: number;
  title?: string;
  reason?: string;
}

export interface Settings {
  id: string;
  simpleMode: boolean;
  collapse: boolean;
  collapseMode: (typeof COLLAPSE_MODE)[keyof typeof COLLAPSE_MODE];
}

export type StorageData = {
  readFics: Record<string, ReadFic>;
  ignoredFics: Record<string, IgnoredFic>;
  settings: Record<string, Settings>;
};

export type StorageResult<T = void> = {
  data?: T;
  error?: unknown;
  success: boolean;
};
