import { FinishedStatus, ReadingStatus } from "../enums/works";

export interface FinishedWork {
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
  finishedWorks: Record<string, FinishedWork>;
  inProgressWorks: Record<string, InProgressWork>;
  ignoredWorks: Record<string, IgnoredWork>;
};

export interface WorkStateData {
  finishedWork?: FinishedWork;
  inProgressWork?: InProgressWork;
  ignoredWork?: IgnoredWork;
}
