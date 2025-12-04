import { SymbolId } from "../../enums/symbols";
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
}

export function collectSymbolRules({
  readWork,
  ignoredWork,
  inProgressWork,
  details,
}: SymbolRuleParameters): SymbolRule[] {
  return [
    {
      id: SymbolId.IGNORED,
      shouldApply: () => !!ignoredWork,
      priority: 100,
    },
    {
      id: SymbolId.IN_PROGRESS,
      shouldApply: () => !!inProgressWork,
      priority: 90,
    },
    {
      id: SymbolId.READ,
      shouldApply: () => !!readWork,
      priority: 80,
    },
    {
      id: SymbolId.REREAD_WORTHY,
      shouldApply: () => !!readWork?.rereadWorthy,
      priority: 70,
    },
    {
      id: SymbolId.TIMES_READ,
      shouldApply: () => !!readWork?.timesRead && readWork.timesRead > 1,
      getCustomLabel: () =>
        readWork!.timesRead === 1
          ? "Read 1 time"
          : `Read ${readWork!.timesRead} times`,
      getSuffix: () => `x${readWork!.timesRead}`,
      priority: 60,
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
      priority: 50,
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
