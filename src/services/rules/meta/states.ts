import { BaseRule, BaseRuleCollector } from "../base";

import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface StateMetaRuleParams {
  states: WorkStateData;
  modules: ModuleStates;
}

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
    states: { finishedWork, inProgressWork, ignoredWork },
    modules: { finishedModule, inProgressModule, ignoredModule },
  }: StateMetaRuleParams): StateMetaRule[] {
    return [
      {
        key: "finished",
        label: "Finished",
        getValue: () => (!!finishedWork ? "Yes" : "No"),
        shouldApply: () => !!finishedModule.enabled,
        priority: 100,
      },
      {
        key: "in-progress",
        label: "In progress",
        getValue: () => (!!inProgressWork ? "Yes" : "No"),
        shouldApply: () => !!inProgressModule.enabled,
        priority: 90,
      },
      {
        key: "ignored",
        label: "Ignored",
        getValue: () => (!!ignoredWork ? "Yes" : "No"),
        shouldApply: () => !!ignoredModule.enabled,
        priority: 80,
      },
    ];
  }
}

export const stateMetaRuleCollector = new StateMetaRuleCollector();
