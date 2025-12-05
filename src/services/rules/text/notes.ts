import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkStateData } from "../../../types/works";

type NotesTextRule = {
  className: string;
  shouldApply: () => boolean;
  getText: () => string;
  priority: number;
};

export interface TextNotesRuleParameters extends WorkStateData {}

export function collectNotesTextRules({
  readWork,
  inProgressWork,
  ignoredWork,
}: TextNotesRuleParameters): NotesTextRule[] {
  return [
    {
      className: `${CLASS_PREFIX}__notes--ignored`,
      shouldApply: () => !!ignoredWork?.reason,
      getText: () => ignoredWork!.reason || "",
      priority: 100,
    },
    {
      className: `${CLASS_PREFIX}__notes--in-progress`,
      shouldApply: () => !!inProgressWork?.notes,
      getText: () => inProgressWork!.notes || "",
      priority: 90,
    },
    {
      className: `${CLASS_PREFIX}__notes--read`,
      shouldApply: () => !!readWork?.notes,
      getText: () => readWork!.notes || "",
      priority: 80,
    },
  ];
}

export function getActiveTextNotesRules(
  params: TextNotesRuleParameters
): NotesTextRule[] {
  return collectNotesTextRules(params)
    .filter((rule) => rule.shouldApply())
    .sort((a, b) => b.priority - a.priority);
}
