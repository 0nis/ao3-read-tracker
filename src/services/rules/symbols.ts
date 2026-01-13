import { BaseRule, BaseRuleCollector } from "./base";

import { SymbolDisplayMode, SymbolId } from "../../enums/symbols";
import { FinishedStatus, ReadingStatus } from "../../enums/works";
import { WorkStateData } from "../../types/works";
import { SymbolData } from "../../types/symbols";

export interface SymbolRuleParams extends WorkStateData {
  symbols: SymbolData;
  details?: {
    latestChapter?: number;
  };
  /** State/status settings for specific symbol types */
  displayMode?: {
    finished?: SymbolDisplayMode;
    inProgress?: SymbolDisplayMode;
  };
  options?: {
    /** If false, no rule will match */
    enabled?: boolean;

    /** Optionally overwrite displayMode */
    showState?: boolean;
    showStatus?: boolean;
  };
}

export interface SymbolRule extends BaseRule {
  id: SymbolId;
  getCustomLabel?: () => string;
  getSuffix?: () => string | undefined;
}

class SymbolRuleCollector extends BaseRuleCollector<
  SymbolRuleParams,
  SymbolRule
> {
  collect({
    symbols,
    finishedWork,
    ignoredWork,
    inProgressWork,
    details,
    displayMode,
    options,
  }: SymbolRuleParams): SymbolRule[] {
    if (options?.enabled === false) return [];

    const getShowState = (mode?: SymbolDisplayMode) =>
      options?.showState ??
      (mode === SymbolDisplayMode.STATE_ONLY ||
        mode === SymbolDisplayMode.BOTH);

    const getShowStatus = (mode?: SymbolDisplayMode) =>
      options?.showStatus ??
      (mode === SymbolDisplayMode.STATUS_ONLY ||
        mode === SymbolDisplayMode.BOTH);

    return [
      {
        id: SymbolId.IGNORED,
        shouldApply: () => !!ignoredWork,
        priority: symbols[SymbolId.IGNORED].priority,
      },
      {
        id: SymbolId.IN_PROGRESS,
        shouldApply: () =>
          !!inProgressWork && getShowState(displayMode?.inProgress),
        priority: symbols[SymbolId.IN_PROGRESS].priority,
      },
      {
        id: SymbolId.FINISHED,
        shouldApply: () =>
          !!finishedWork && getShowState(displayMode?.finished),
        priority: symbols[SymbolId.FINISHED].priority,
      },
      {
        id: SymbolId.REREAD_WORTHY,
        shouldApply: () => !!finishedWork?.rereadWorthy,
        priority: symbols[SymbolId.REREAD_WORTHY].priority,
      },
      {
        id: SymbolId.STATUS_COMPLETED,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.COMPLETED &&
          getShowStatus(displayMode?.finished),
        priority: symbols[SymbolId.STATUS_COMPLETED].priority,
      },
      {
        id: SymbolId.STATUS_DROPPED,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.DROPPED &&
          getShowStatus(displayMode?.finished),
        priority: symbols[SymbolId.STATUS_DROPPED].priority,
      },
      {
        id: SymbolId.STATUS_DORMANT,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.DORMANT &&
          getShowStatus(displayMode?.finished),
        priority: symbols[SymbolId.STATUS_DORMANT].priority,
      },
      {
        id: SymbolId.STATUS_READING_ACTIVE,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.ACTIVE &&
          getShowStatus(displayMode?.inProgress),
        priority: symbols[SymbolId.STATUS_READING_ACTIVE].priority,
      },
      {
        id: SymbolId.STATUS_READING_WAITING,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.WAITING &&
          getShowStatus(displayMode?.inProgress),
        priority: symbols[SymbolId.STATUS_READING_WAITING].priority,
      },
      {
        id: SymbolId.STATUS_READING_PAUSED,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.PAUSED &&
          getShowState(displayMode?.inProgress),
        priority: symbols[SymbolId.STATUS_READING_PAUSED].priority,
      },
      {
        id: SymbolId.TIMES_READ,
        shouldApply: () =>
          !!finishedWork?.timesRead && finishedWork.timesRead > 1,
        getCustomLabel: () =>
          finishedWork!.timesRead === 1
            ? "Read 1 time"
            : `Read ${finishedWork!.timesRead} times`,
        getSuffix: () => `x${finishedWork!.timesRead}`,
        priority: symbols[SymbolId.TIMES_READ].priority,
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
        priority: symbols[SymbolId.NEW_CHAPTERS_AVAILABLE].priority,
      },
    ];
  }
}

export const symbolRuleCollector = new SymbolRuleCollector();
