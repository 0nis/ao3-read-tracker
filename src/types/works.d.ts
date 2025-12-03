import { ReadingStatus } from "../enums/works";

// TODO in future issue:
// Change to dateFinished
// Make one of the dates optional (less bloat for simple mode)
// Explore the idea of adding multiple "finished at" dates for rereads
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

export interface InProgressWork {
  id: string;
  lastReadAt: number;
  startedAt?: number;
  title?: string;
  notes?: string;
  lastReadChapter?: number;
  readingStatus?: ReadingStatus;
}

// TODO in future issue:
// Remove one of the dates, it's redundant
export interface IgnoredWork {
  id: string;
  createdAt: number;
  modifiedAt: number;
  title?: string;
  reason?: string;
}

export type WorkData = {
  readWorks: Record<string, ReadWork>;
  inProgressWorks: Record<string, InProgressWork>;
  ignoredWorks: Record<string, IgnoredWork>;
};
