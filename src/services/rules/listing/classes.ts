import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import * as Classes from "../../../constants/classes";
import { FinishedStatus, ReadingStatus } from "../../../enums/works";
import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export interface ClassRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
  details?: {
    latestChapter?: number;
  };
}

interface ClassRule extends BaseRule {
  className: string;
}

class ClassRuleCollector extends BaseRuleCollector<ClassRuleParams, ClassRule> {
  collect({ states, modules, details }: ClassRuleParams): ClassRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
    return [
      {
        className: Classes.FINISHED_CLASS,
        shouldApply: () => !!finishedWork,
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
        shouldApply: () => !!finishedWork?.rereadWorthy,
      },
      {
        className: Classes.COMPLETED_CLASS,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.COMPLETED,
      },
      {
        className: Classes.DROPPED_CLASS,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.DROPPED,
      },
      {
        className: Classes.DORMANT_CLASS,
        shouldApply: () =>
          finishedWork?.finishedStatus === FinishedStatus.DORMANT,
      },
      {
        className: Classes.ACTIVE_READING_CLASS,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.ACTIVE,
      },
      {
        className: Classes.WAITING_TO_READ_CLASS,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.WAITING,
      },
      {
        className: Classes.PAUSED_READING_CLASS,
        shouldApply: () =>
          inProgressWork?.readingStatus === ReadingStatus.PAUSED,
      },
      {
        className: Classes.NEW_CHAPTERS_AVAILABLE_CLASS,
        shouldApply: () => {
          if (
            !inProgressWork ||
            !inProgressWork?.lastReadChapter ||
            !details?.latestChapter
          )
            return false;
          return inProgressWork.lastReadChapter < (details?.latestChapter || 0);
        },
      },
    ];
  }
}

export const classRuleCollector = new ClassRuleCollector();
