import { BaseMetaItemRule } from "../details";
import { BaseRuleCollector } from "../../base";

import { getFormattedDate } from "../../../../utils/date";
import { InProgressWork } from "../../../../types/works";

export interface InProgressMetaRuleParams {
  work: InProgressWork;
}

interface InProgressMetaRule extends BaseMetaItemRule {}

class InProgressMetaRuleCollector extends BaseRuleCollector<
  InProgressMetaRuleParams,
  InProgressMetaRule
> {
  collect({ work }: InProgressMetaRuleParams): InProgressMetaRule[] {
    return [
      {
        key: "last-read-at",
        label: "Last Read",
        getValue: () => getFormattedDate(work.lastReadAt, "-"),
        shouldApply: () => work.lastReadAt !== undefined,
        priority: 90,
      },
      {
        key: "status",
        label: "Status",
        getValue: () => String(work.readingStatus),
        shouldApply: () => work.readingStatus !== undefined,
        priority: 80,
      },
      {
        key: "last-read-chapter",
        label: "Last Read Chapter",
        getValue: () => String(work.lastReadChapter),
        shouldApply: () => work.lastReadChapter !== undefined,
        priority: 70,
      },
    ];
  }
}

export const inProgressMetaRuleCollector = new InProgressMetaRuleCollector();
