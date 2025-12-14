import { BaseRule, BaseRuleCollector } from "../base";

import { DisplayMode } from "../../../enums/settings";
import { FinishedStatus } from "../../../enums/works";
import { SettingsData } from "../../../types/settings";
import { WorkStateData } from "../../../types/works";

export interface DisplayRuleParams extends WorkStateData {
  settings: SettingsData;
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
    settings,
    finishedWork,
    inProgressWork,
    ignoredWork,
  }: DisplayRuleParams): DisplayRule[] {
    return [
      {
        name: "ignored",
        shouldApply: () => !!ignoredWork,
        getMode: () => settings.ignoreSettings.defaultDisplayMode,
      },
      {
        name: "in progress",
        shouldApply: () => !!inProgressWork,
        getMode: () => settings.inProgressSettings.defaultDisplayMode,
      },
      {
        name: "reread worthy",
        shouldApply: () => !!finishedWork?.rereadWorthy,
        getMode: () => settings.finishedSettings.rereadWorthyDisplayMode,
      },
      {
        name: "finished (default)",
        shouldApply: () => !!finishedWork,
        getMode: () => settings.finishedSettings.defaultDisplayMode,
      },
      {
        name: "finished (completed)",
        shouldApply: () =>
          !!finishedWork &&
          finishedWork.finishedStatus === FinishedStatus.COMPLETED,
        getMode: () => settings.finishedSettings.completedDisplayMode,
      },
      {
        name: "finished (abandoned)",
        shouldApply: () =>
          !!finishedWork &&
          finishedWork.finishedStatus === FinishedStatus.ABANDONED,
        getMode: () => settings.finishedSettings.abandonedDisplayMode,
      },
    ];
  }
}

export const displayRuleCollector = new DisplayRuleCollector();
