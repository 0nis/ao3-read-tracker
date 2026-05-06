import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface WorkNotesRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
}

interface WorkNotesTextRule extends BaseRule {
  label: string;
  className: string;
  getText: () => string;
}

class WorkNotesRuleCollector extends BaseRuleCollector<
  WorkNotesRuleParams,
  WorkNotesTextRule
> {
  collect({ states, modules }: WorkNotesRuleParams): WorkNotesTextRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
    return [
      {
        label: "Ignored Reason",
        className: `${CLASS_PREFIX}__notes--ignored`,
        shouldApply: () => !!ignoredWork?.reason,
        getText: () => ignoredWork!.reason || "",
        priority: 100,
      },
      {
        label: "In-Progress Notes",
        className: `${CLASS_PREFIX}__notes--in-progress`,
        shouldApply: () => !!inProgressWork?.notes,
        getText: () => inProgressWork!.notes || "",
        priority: 90,
      },
      {
        label: "Finished Notes",
        className: `${CLASS_PREFIX}__notes--finished`,
        shouldApply: () => !!finishedWork?.notes,
        getText: () => finishedWork!.notes || "",
        priority: 80,
      },
    ];
  }
}

export const workNotesRuleCollector = new WorkNotesRuleCollector();
