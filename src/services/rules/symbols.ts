import { SymbolId } from "../../enums/symbols";
import { ReadWork, IgnoredWork } from "../../types/works";
import { getLatestChapterFromWorkListing } from "../../utils/ao3";

export interface SymbolRule {
  id: SymbolId;
  shouldApply: () => boolean;
  getCustomLabel?: () => string;
  getSuffix?: () => string | undefined;
  priority: number;
}

export function collectSymbolRules(
  details: {
    latestChapter?: number;
  },
  read?: ReadWork,
  ignored?: IgnoredWork
): SymbolRule[] {
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
        if (!read?.isReading || !read.lastReadChapter) return false;
        return read.lastReadChapter < (details.latestChapter || 0);
      },
      getCustomLabel: () =>
        `New chapters available! (last read: chapter ${read!.lastReadChapter})`,
      priority: 50,
    },
  ];
}

export function getActiveSymbolRules(
  work: HTMLElement,
  read?: ReadWork,
  ignored?: IgnoredWork
) {
  return collectSymbolRules(
    { latestChapter: getLatestChapterFromWorkListing(work) || 0 },
    read,
    ignored
  )
    .filter((rule) => rule.shouldApply())
    .sort((a, b) => b.priority - a.priority);
}
