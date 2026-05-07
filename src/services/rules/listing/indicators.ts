import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { WorkState } from "../../../enums/works";
import { WorkStateData } from "../../../types/works";
import { LabelSettings, ModuleStates } from "../../../types/settings";

export interface TextIndicatorRuleParams {
  states: WorkStateData;
  labelSettings: LabelSettings;
  modules?: ModuleStates;
}

interface TextIndicatorRule extends BaseRule {
  workState: WorkState;
  getText: () => string;
  getNotes: () => string | undefined;
  getStatus: () => string | undefined;
}

class TextIndicatorRuleCollector extends BaseRuleCollector<
  TextIndicatorRuleParams,
  TextIndicatorRule
> {
  collect({
    states,
    modules,
    labelSettings: { stateIndicators },
  }: TextIndicatorRuleParams): TextIndicatorRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
    return [
      {
        workState: WorkState.IGNORED,
        shouldApply: () => !!ignoredWork,
        getText: () => stateIndicators.ignored,
        getNotes: () => ignoredWork?.reason,
        getStatus: () => "none",
        priority: 100,
      },
      {
        workState: WorkState.IN_PROGRESS,
        shouldApply: () => !!inProgressWork,
        getText: () => stateIndicators.in_progress,
        getNotes: () => inProgressWork?.notes,
        getStatus: () => inProgressWork?.readingStatus,
        priority: 90,
      },
      {
        workState: WorkState.FINISHED,
        shouldApply: () => !!finishedWork,
        getText: () => stateIndicators.finished,
        getNotes: () => finishedWork?.notes,
        getStatus: () => finishedWork?.finishedStatus,
        priority: 80,
      },
    ];
  }
}

export const textIndicatorRuleCollector = new TextIndicatorRuleCollector();
