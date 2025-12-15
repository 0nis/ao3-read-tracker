import { BaseRule, BaseRuleCollector } from "./base";

import { SymbolDisplayMode, SymbolId } from "../../enums/symbols";
import { FinishedStatus, ReadingStatus } from "../../enums/works";
import { WorkStateData } from "../../types/works";

export interface SymbolRuleParams extends WorkStateData {
  details?: {
    latestChapter?: number;
  };
  displayMode?: {
    finished?: SymbolDisplayMode;
    inProgress?: SymbolDisplayMode;
  };
  options?: {
    showState?: boolean;
    showStatus?: boolean;
    hideSymbols?: boolean;
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
    finishedWork,
    ignoredWork,
    inProgressWork,
    details,
    displayMode,
    options,
  }: SymbolRuleParams): SymbolRule[] {
    if (options?.hideSymbols) return [];

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
        priority: 100,
      },
      {
        id: SymbolId.IN_PROGRESS,
        shouldApply: () =>
          !!inProgressWork && getShowState(displayMode?.inProgress),
        priority: 90,
      },
      {
        id: SymbolId.FINISHED,
        shouldApply: () =>
          !!finishedWork && getShowState(displayMode?.finished),
        priority: 80,
      },
      {
        id: SymbolId.REREAD_WORTHY,
        shouldApply: () => !!finishedWork?.rereadWorthy,
        priority: 70,
      },
      {
        id: SymbolId.STATUS_COMPLETED,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.COMPLETED &&
          getShowStatus(displayMode?.finished),
        priority: 40,
      },
      {
        id: SymbolId.STATUS_ABANDONED,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.ABANDONED &&
          getShowStatus(displayMode?.finished),
        priority: 40,
      },
      {
        id: SymbolId.STATUS_READING_ACTIVE,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.ACTIVE &&
          getShowStatus(displayMode?.inProgress),
        priority: 40,
      },
      {
        id: SymbolId.STATUS_READING_WAITING,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.WAITING &&
          getShowStatus(displayMode?.inProgress),
        priority: 40,
      },
      {
        id: SymbolId.STATUS_READING_PAUSED,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.PAUSED &&
          getShowState(displayMode?.inProgress),
        priority: 40,
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
}

export const symbolRuleCollector = new SymbolRuleCollector();
