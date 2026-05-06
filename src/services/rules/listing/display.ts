import { BaseRule, BaseRuleCollector } from "../base";
import { cleanStates } from "../helpers";

import { DisplayMode } from "../../../enums/settings";
import { FinishedStatus, ReadingStatus } from "../../../enums/works";
import { ModuleStates, SettingsData } from "../../../types/settings";
import { WorkStateData } from "../../../types/works";

export interface DisplayRuleParams {
  states: WorkStateData;
  modules?: ModuleStates;
  settings: SettingsData;
  details?: {
    latestChapter?: number;
  };
}

interface DisplayRule extends BaseRule {
  name: string;
  getMode: () => DisplayMode;
}

class DisplayRuleCollector extends BaseRuleCollector<
  DisplayRuleParams,
  DisplayRule
> {
  collect({
    states,
    modules,
    settings,
    details,
  }: DisplayRuleParams): DisplayRule[] {
    const { finishedWork, inProgressWork, ignoredWork } = cleanStates(
      states,
      modules,
    );
    return [
      {
        name: "ignored (default)",
        shouldApply: () => !!ignoredWork,
        getMode: () => settings.ignoreSettings.defaultDisplayMode,
      },
      {
        name: "in progress (default)",
        shouldApply: () => !!inProgressWork,
        getMode: () => settings.inProgressSettings.displayModes.default,
      },
      {
        name: "in progress (active)",
        shouldApply: () =>
          !!inProgressWork &&
          inProgressWork.readingStatus === ReadingStatus.ACTIVE,
        getMode: () => settings.inProgressSettings.displayModes.statusActive,
      },
      {
        name: "in progress (paused)",
        shouldApply: () =>
          !!inProgressWork &&
          inProgressWork.readingStatus === ReadingStatus.PAUSED,
        getMode: () => settings.inProgressSettings.displayModes.statusPaused,
      },
      {
        name: "in progress (waiting)",
        shouldApply: () =>
          !!inProgressWork &&
          inProgressWork.readingStatus === ReadingStatus.WAITING,
        getMode: () => settings.inProgressSettings.displayModes.statusWaiting,
      },
      {
        name: "new chapters available",
        shouldApply: () => {
          if (
            !inProgressWork ||
            !inProgressWork?.lastReadChapter ||
            !details?.latestChapter
          )
            return false;
          return inProgressWork.lastReadChapter < (details?.latestChapter || 0);
        },
        getMode: () =>
          settings.inProgressSettings.displayModes.newChaptersAvailable,
      },
      {
        name: "finished (default)",
        shouldApply: () => !!finishedWork,
        getMode: () => settings.finishedSettings.displayModes.default,
      },
      {
        name: "finished (completed)",
        shouldApply: () =>
          !!finishedWork &&
          finishedWork.finishedStatus === FinishedStatus.COMPLETED,
        getMode: () => settings.finishedSettings.displayModes.statusCompleted,
      },
      {
        name: "finished (dropped)",
        shouldApply: () =>
          !!finishedWork &&
          finishedWork.finishedStatus === FinishedStatus.DROPPED,
        getMode: () => settings.finishedSettings.displayModes.statusDropped,
      },
      {
        name: "finished (dormant)",
        shouldApply: () =>
          !!finishedWork &&
          finishedWork.finishedStatus === FinishedStatus.DORMANT,
        getMode: () => settings.finishedSettings.displayModes.statusDormant,
      },
      {
        name: "reread worthy",
        shouldApply: () => !!finishedWork?.rereadWorthy,
        getMode: () => settings.finishedSettings.displayModes.rereadWorthy,
      },
    ];
  }
}

export const displayRuleCollector = new DisplayRuleCollector();
