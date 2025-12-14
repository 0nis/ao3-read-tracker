import { BaseMetaItemRule } from "../details";
import { BaseRuleCollector } from "../../base";

import { FinishedWork } from "../../../../types/works";

export interface FinishedMetaRuleParams {
  work: FinishedWork;
}

interface FinishedMetaRule extends BaseMetaItemRule {}

class FinishedMetaRuleCollector extends BaseRuleCollector<
  FinishedMetaRuleParams,
  FinishedMetaRule
> {
  collect({ work }: FinishedMetaRuleParams): FinishedMetaRule[] {
    return [
      {
        key: "status",
        label: "Status",
        getValue: () => String(work.finishedStatus),
        shouldApply: () => work.finishedStatus !== undefined,
        priority: 90,
      },
      {
        key: "reread-worthy",
        label: "Reread Worthy",
        getValue: () => (work.rereadWorthy ? "Yes" : "No"),
        shouldApply: () => work.rereadWorthy !== undefined,
        priority: 80,
      },
      {
        key: "times-read",
        label: "Times Read",
        getValue: () => String(work.timesRead),
        shouldApply: () => work.timesRead !== undefined,
        priority: 70,
      },
    ];
  }
}

export const finishedMetaRuleCollector = new FinishedMetaRuleCollector();
