import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface StateMetaRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
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
  collect({ states, modules }: StateMetaRuleParams): StateMetaRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
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
