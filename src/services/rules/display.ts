import { DisplayMode } from "../../enums/settings";
import { FinishedStatus } from "../../enums/works";
import { SettingsData } from "../../types/settings";
import { WorkStateData } from "../../types/works";

type DisplayRule = {
  name: string;
  shouldApply: () => boolean;
  getMode: () => DisplayMode;
};

export interface DisplayRuleParameters extends WorkStateData {
  settings: SettingsData;
}

export function collectDisplayRules({
  settings,
  finishedWork,
  inProgressWork,
  ignoredWork,
}: DisplayRuleParameters): DisplayRule[] {
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
