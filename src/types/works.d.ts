export interface ReadWork {
  id: string;
  createdAt: number;
  modifiedAt: number;
  title?: string;
  rereadWorthy?: boolean;
  count?: number;
  notes?: string;
  isReading?: boolean;
  lastReadChapter?: number;
}

export interface IgnoredWork {
  id: string;
  createdAt: number;
  modifiedAt: number;
  title?: string;
  reason?: string;
}

export type WorkData = {
  readWorks: Record<string, ReadWork>;
  ignoredWorks: Record<string, IgnoredWork>;
};
