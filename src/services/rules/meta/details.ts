import { BaseRule, BaseRuleCollector } from "../base";

import { stateMetaRuleCollector } from "./groups/state";
import { finishedMetaRuleCollector } from "./groups/finished";
import { inProgressMetaRuleCollector } from "./groups/in-progress";

import { getExtensionName } from "../../../utils/extension";
import { WorkStateData } from "../../../types/works";

export interface MetaGroupRuleParams extends WorkStateData {}

export interface BaseMetaItemRule extends BaseRule {
  key: string;
  label: string;
  getValue: () => string;
}

interface MetaGroupRule extends BaseRule {
  key: string;
  label: string;
  getRules: () => BaseMetaItemRule[];
}

class MetaGroupRuleCollector extends BaseRuleCollector<
  MetaGroupRuleParams,
  MetaGroupRule
> {
  collect({
    finishedWork,
    inProgressWork,
    ignoredWork,
  }: MetaGroupRuleParams): MetaGroupRule[] {
    const name = getExtensionName();
    return [
      {
        key: "states",
        label: `${name} States`,
        shouldApply: () => true,
        getRules: () =>
          stateMetaRuleCollector.getActiveRules({
            finishedWork,
            inProgressWork,
            ignoredWork,
          }),
        priority: 100,
      },

      {
        key: "finished",
        label: "Finished Details",
        shouldApply: () =>
          !!finishedWork &&
          finishedMetaRuleCollector.getActiveRules({ work: finishedWork })
            .length > 0,
        getRules: () =>
          finishedMetaRuleCollector.getActiveRules({ work: finishedWork! }),
        priority: 90,
      },

      {
        key: "inprogress",
        label: "In-Progress Details",
        shouldApply: () =>
          !!inProgressWork &&
          inProgressMetaRuleCollector.getActiveRules({ work: inProgressWork })
            .length > 0,
        getRules: () =>
          inProgressMetaRuleCollector.getActiveRules({ work: inProgressWork! }),
        priority: 80,
      },
    ];
  }
}

export const metaGroupRuleCollector = new MetaGroupRuleCollector();
