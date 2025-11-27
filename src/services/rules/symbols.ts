import { SymbolId } from "@enums";
import { ReadWork, IgnoredWork } from "@types";

export interface SymbolRule {
  id: SymbolId;
  shouldApply: () => boolean;
  getCustomLabel?: () => string;
  getSuffix?: () => string | undefined;
  priority: number;
}

export interface SymbolRuleParameters {
  read?: ReadWork;
  ignored?: IgnoredWork;
  details?: {
    latestChapter?: number;
  };
}

export function collectSymbolRules({
  read,
  ignored,
  details,
}: SymbolRuleParameters): SymbolRule[] {
  return [
    {
      id: SymbolId.IGNORED,
      shouldApply: () => !!ignored,
      priority: 100,
    },
    {
      id: SymbolId.READING,
      shouldApply: () => !!read?.isReading,
      priority: 90,
    },
    {
      id: SymbolId.READ,
      shouldApply: () => !!read && !read.isReading,
      priority: 80,
    },
    {
      id: SymbolId.REREAD_WORTHY,
      shouldApply: () => !!read?.rereadWorthy,
      priority: 70,
    },
    {
      id: SymbolId.READ_COUNT,
      shouldApply: () => !!read?.count,
      getCustomLabel: () =>
        read!.count === 1 ? "Read 1 time" : `Read ${read!.count} times`,
      getSuffix: () => `x${read!.count}`,
      priority: 60,
    },
    {
      id: SymbolId.NEW_CHAPTERS_AVAILABLE,
      shouldApply: () => {
        if (
          !read?.isReading ||
          !read?.lastReadChapter ||
          !details?.latestChapter
        )
          return false;
        return read.lastReadChapter < (details?.latestChapter || 0);
      },
      getCustomLabel: () =>
        `New chapters available! (last read: chapter ${
          read?.lastReadChapter || "?"
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
