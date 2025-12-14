import { BaseMetaItemRule } from "../details";
import { BaseRuleCollector } from "../../base";

import { WorkStateData } from "../../../../types/works";
import { getFormattedDate } from "../../../../utils/date";

export interface StateMetaRuleParams extends WorkStateData {}

interface StateMetaRule extends BaseMetaItemRule {}

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
        getValue: () =>
          !!finishedWork
            ? getFormattedDate(finishedWork.finishedAt, "-")
            : "No",
        shouldApply: () => true,
        priority: 100,
      },
      {
        key: "in-progress",
        label: "In Progress",
        getValue: () =>
          !!inProgressWork
            ? getFormattedDate(inProgressWork.startedAt, "-")
            : "No",
        shouldApply: () => true,
        priority: 90,
      },
      {
        key: "ignored",
        label: "Ignored",
        getValue: () =>
          !!ignoredWork ? getFormattedDate(ignoredWork.ignoredAt, "-") : "No",
        shouldApply: () => true,
        priority: 80,
      },
    ];
  }
}

export const stateMetaRuleCollector = new StateMetaRuleCollector();
