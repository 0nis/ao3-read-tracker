import { BaseRule, BaseRuleCollector } from "../base";
import { WorkStateData } from "../../../types/works";

export interface StateMetaRuleParams extends WorkStateData {}

interface StateMetaRule extends BaseRule {
  key: string;
  label: string;
  getValue: () => string;
}

class StateMetaRuleCollector extends BaseRuleCollector<
  StateMetaRuleParams,
  StateMetaRule
> {
  collect({
    finishedWork,
    inProgressWork,
    ignoredWork,
  }: StateMetaRuleParams): StateMetaRule[] {
    return [
      {
        key: "finished",
        label: "Finished",
        getValue: () => (!!finishedWork ? "Yes" : "No"),
        shouldApply: () => true,
        priority: 100,
      },
      {
        key: "in-progress",
        label: "In progress",
        getValue: () => (!!inProgressWork ? "Yes" : "No"),
        shouldApply: () => true,
        priority: 90,
      },
      {
        key: "ignored",
        label: "Ignored",
        getValue: () => (!!ignoredWork ? "Yes" : "No"),
        shouldApply: () => true,
        priority: 80,
      },
    ];
  }
}

export const stateMetaRuleCollector = new StateMetaRuleCollector();
