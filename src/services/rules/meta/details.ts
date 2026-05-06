import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { getFormattedDate } from "../../../utils/date";
import { capitalizeFirstLetter } from "../../../utils/string";
import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface DetailsMetaRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
}

interface DetailsMetaRule extends BaseRule {
  key: string;
  label: string;
  getValue: () => string;
}

class DetailsMetaRuleCollector extends BaseRuleCollector<
  DetailsMetaRuleParams,
  DetailsMetaRule
> {
  collect({ states, modules }: DetailsMetaRuleParams): DetailsMetaRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
    return [
      {
        key: "ignored-at",
        label: "Ignored at",
        getValue: () => getFormattedDate(ignoredWork?.ignoredAt, "-"),
        shouldApply: () => ignoredWork?.ignoredAt !== undefined,
        priority: 100,
      },
      {
        key: "finished-at",
        label: "Finished at",
        getValue: () => getFormattedDate(finishedWork?.finishedAt, "-"),
        shouldApply: () => finishedWork?.finishedAt !== undefined,
        priority: 90,
      },
      {
        key: "in-progress-since",
        label: "In progress since",
        getValue: () => getFormattedDate(inProgressWork?.startedAt, "-"),
        shouldApply: () => inProgressWork?.startedAt !== undefined,
        priority: 80,
      },
      {
        key: "last-read-at",
        label: "Last read at",
        getValue: () => getFormattedDate(inProgressWork?.lastReadAt, "-"),
        shouldApply: () => inProgressWork?.lastReadAt !== undefined,
        priority: 70,
      },
      {
        key: "last-read-chapter",
        label: "Last read chapter",
        getValue: () => String(inProgressWork?.lastReadChapter),
        shouldApply: () => inProgressWork?.lastReadChapter !== undefined,
        priority: 60,
      },
      {
        key: "finished-status",
        label: "Finished status",
        getValue: () =>
          capitalizeFirstLetter(String(finishedWork?.finishedStatus)),
        shouldApply: () => finishedWork?.finishedStatus !== undefined,
        priority: 50,
      },
      {
        key: "reading-status",
        label: "Reading status",
        getValue: () =>
          capitalizeFirstLetter(String(inProgressWork?.readingStatus)),
        shouldApply: () => inProgressWork?.readingStatus !== undefined,
        priority: 40,
      },
      {
        key: "times-read",
        label: "Times read",
        getValue: () => String(finishedWork?.timesRead),
        shouldApply: () => finishedWork?.timesRead !== undefined,
        priority: 30,
      },
      {
        key: "reread-worthy",
        label: "Reread worthy",
        getValue: () => (finishedWork?.rereadWorthy ? "Yes" : "No"),
        shouldApply: () => finishedWork?.rereadWorthy !== undefined,
        priority: 20,
      },
    ];
  }
}

export const detailsMetaRuleCollector = new DetailsMetaRuleCollector();
