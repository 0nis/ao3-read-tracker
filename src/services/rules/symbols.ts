import { SymbolDisplayMode, SymbolId } from "../../enums/symbols";
import { FinishedStatus, ReadingStatus } from "../../enums/works";
import { ReadWork, IgnoredWork, InProgressWork } from "../../types/works";

export interface SymbolRule {
  id: SymbolId;
  shouldApply: () => boolean;
  getCustomLabel?: () => string;
  getSuffix?: () => string | undefined;
  priority: number;
}

export interface SymbolRuleParameters {
  readWork?: ReadWork;
  ignoredWork?: IgnoredWork;
  inProgressWork?: InProgressWork;
  details?: {
    latestChapter?: number;
  };
  displayMode?: SymbolDisplayMode;
  options?: {
    showState?: boolean;
    showStatus?: boolean;
  };
}

export function collectSymbolRules({
  readWork,
  ignoredWork,
  inProgressWork,
  details,
  displayMode,
  options,
}: SymbolRuleParameters): SymbolRule[] {
  if (displayMode === SymbolDisplayMode.NONE) return [];

  const showState =
    options?.showState ??
    (displayMode === SymbolDisplayMode.STATE_ONLY ||
      displayMode === SymbolDisplayMode.BOTH);
  const showStatus =
    options?.showStatus ??
    (displayMode === SymbolDisplayMode.STATUS_ONLY ||
      displayMode === SymbolDisplayMode.BOTH);

  return [
    {
      id: SymbolId.IGNORED,
      shouldApply: () => !!ignoredWork,
      priority: 100,
    },
    {
      id: SymbolId.IN_PROGRESS,
      shouldApply: () => !!inProgressWork && showState,
      priority: 90,
    },
    {
      id: SymbolId.READ,
      shouldApply: () => !!readWork && showState,
      priority: 80,
    },
    {
      id: SymbolId.REREAD_WORTHY,
      shouldApply: () => !!readWork?.rereadWorthy,
      priority: 70,
    },
    {
      id: SymbolId.STATUS_COMPLETED,
      shouldApply: () =>
        readWork?.finishedStatus === FinishedStatus.COMPLETED && showStatus,
      priority: 40,
    },
    {
      id: SymbolId.STATUS_ABANDONED,
      shouldApply: () =>
        readWork?.finishedStatus === FinishedStatus.ABANDONED && showStatus,
      priority: 40,
    },
    {
      id: SymbolId.STATUS_READING_ACTIVE,
      shouldApply: () =>
        inProgressWork?.readingStatus === ReadingStatus.ACTIVE && showStatus,
      priority: 40,
    },
    {
      id: SymbolId.STATUS_READING_WAITING,
      shouldApply: () =>
        inProgressWork?.readingStatus === ReadingStatus.WAITING && showStatus,
      priority: 40,
    },
    {
      id: SymbolId.STATUS_READING_PAUSED,
      shouldApply: () =>
        inProgressWork?.readingStatus === ReadingStatus.PAUSED && showStatus,
      priority: 40,
    },
    {
      id: SymbolId.TIMES_READ,
      shouldApply: () => !!readWork?.timesRead && readWork.timesRead > 1,
      getCustomLabel: () =>
        readWork!.timesRead === 1
          ? "Read 1 time"
          : `Read ${readWork!.timesRead} times`,
      getSuffix: () => `x${readWork!.timesRead}`,
      priority: 20,
    },
    {
      id: SymbolId.NEW_CHAPTERS_AVAILABLE,
      shouldApply: () => {
        if (
          !inProgressWork ||
          !inProgressWork?.lastReadChapter ||
          !details?.latestChapter
        )
          return false;
        return inProgressWork.lastReadChapter < (details?.latestChapter || 0);
      },
      getCustomLabel: () =>
        `New chapters available! (last read: chapter ${
          inProgressWork?.lastReadChapter || "?"
        })`,
      priority: 10,
    },
  ];
}

export function getActiveSymbolRules(
  params: SymbolRuleParameters
): SymbolRule[] {
  return collectSymbolRules(params)
    .filter((rule) => rule.shouldApply())
    .sort((a, b) => b.priority - a.priority);
}
