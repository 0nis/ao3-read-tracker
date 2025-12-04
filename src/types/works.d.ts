import { FinishedStatus, ReadingStatus } from "../enums/works";

// TODO in future issue:
// Explore the idea of adding multiple "finished at" dates for rereads
export interface ReadWork {
  id: string;
  finishedAt: number;
  title?: string;
  notes?: string;
  rereadWorthy?: boolean;
  timesRead?: number;
  finishedStatus?: FinishedStatus;
}

export interface InProgressWork {
  id: string;
  startedAt: number;
  lastReadAt: number;
  title?: string;
  notes?: string;
  lastReadChapter?: number;
  readingStatus?: ReadingStatus;
}

export interface IgnoredWork {
  id: string;
  ignoredAt: number;
  title?: string;
  reason?: string;
}

export type WorkData = {
  readWorks: Record<string, ReadWork>;
  inProgressWorks: Record<string, InProgressWork>;
  ignoredWorks: Record<string, IgnoredWork>;
};
