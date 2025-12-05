import * as Classes from "../../constants/classes";
import { FinishedStatus, ReadingStatus } from "../../enums/works";
import { WorkStateData } from "../../types/works";

type ClassRule = {
  className: string;
  shouldApply: () => boolean;
};

export interface ClassRuleParameters extends WorkStateData {}

export function collectClassRules({
  readWork,
  inProgressWork,
  ignoredWork,
}: ClassRuleParameters): ClassRule[] {
  return [
    {
      className: Classes.READ_CLASS,
      shouldApply: () => !!readWork,
    },
    {
      className: Classes.IGNORED_CLASS,
      shouldApply: () => !!ignoredWork,
    },
    {
      className: Classes.IN_PROGRESS_CLASS,
      shouldApply: () => !!inProgressWork,
    },
    {
      className: Classes.REREAD_WORTHY_CLASS,
      shouldApply: () => !!readWork?.rereadWorthy,
    },
    {
      className: Classes.COMPLETED_CLASS,
      shouldApply: () => readWork?.finishedStatus === FinishedStatus.COMPLETED,
    },
    {
      className: Classes.ABANDONED_CLASS,
      shouldApply: () => readWork?.finishedStatus === FinishedStatus.ABANDONED,
    },
    {
      className: Classes.ACTIVE_READING_CLASS,
      shouldApply: () => inProgressWork?.readingStatus === ReadingStatus.ACTIVE,
    },
    {
      className: Classes.WAITING_TO_READ_CLASS,
      shouldApply: () =>
        inProgressWork?.readingStatus === ReadingStatus.WAITING,
    },
    {
      className: Classes.PAUSED_READING_CLASS,
      shouldApply: () => inProgressWork?.readingStatus === ReadingStatus.PAUSED,
    },
  ];
}
