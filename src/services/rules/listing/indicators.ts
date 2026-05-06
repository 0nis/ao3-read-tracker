import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { WorkState } from "../../../enums/works";
import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface TextIndicatorRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
}

interface TextIndicatorRule extends BaseRule {
  workState: WorkState;
  getTimeStamp: () => number | undefined;
  getText: () => string;
}

class TextIndicatorRuleCollector extends BaseRuleCollector<
  TextIndicatorRuleParams,
  TextIndicatorRule
> {
  collect({ states, modules }: TextIndicatorRuleParams): TextIndicatorRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
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
}

export const textIndicatorRuleCollector = new TextIndicatorRuleCollector();
