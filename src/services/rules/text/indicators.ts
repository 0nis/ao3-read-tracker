import { WorkState } from "../../../enums/works";
import { WorkStateData } from "../../../types/works";

type TextIndicatorRule = {
  workState: WorkState;
  shouldApply: () => boolean;
  getTimeStamp: () => number | undefined;
  getText: () => string;
  priority: number;
};

export interface TextIndicatorRuleParameters extends WorkStateData {}

export function collectTextIndicatorRules({
  finishedWork,
  inProgressWork,
  ignoredWork,
}: TextIndicatorRuleParameters): TextIndicatorRule[] {
  return [
    {
      workState: WorkState.IGNORED,
      shouldApply: () => !!ignoredWork,
      getTimeStamp: () => ignoredWork?.ignoredAt,
      getText: () => `Marked as ignored on %date%`,
      priority: 100,
    },
    {
      workState: WorkState.IN_PROGRESS,
      shouldApply: () => !!inProgressWork,
      getTimeStamp: () => inProgressWork?.startedAt,
      getText: () =>
        `Still reading as of %date% (chapter ${
          inProgressWork?.lastReadChapter || "?"
        }/%latest_chapter%)`,
      priority: 90,
    },
    {
      workState: WorkState.FINISHED,
      shouldApply: () => !!finishedWork,
      getTimeStamp: () => finishedWork?.finishedAt,
      getText: () => `Marked as read on %date%`,
      priority: 80,
    },
  ];
}

export function getActiveTextIndicatorRules(
  params: TextIndicatorRuleParameters
): TextIndicatorRule[] {
  return collectTextIndicatorRules(params)
    .filter((rule) => rule.shouldApply())
    .sort((a, b) => b.priority - a.priority);
}
