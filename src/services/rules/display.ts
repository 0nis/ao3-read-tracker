import { DisplayMode } from "../../enums/settings";
import { FinishedStatus } from "../../enums/works";
import { SettingsData } from "../../types/settings";
import { IgnoredWork, InProgressWork, ReadWork } from "../../types/works";

type DisplayRule = {
  name: string;
  shouldApply: () => boolean;
  getMode: () => DisplayMode;
};

export function collectDisplayRules(
  settings: SettingsData,
  readWork?: ReadWork,
  inProgressWork?: InProgressWork,
  ignoredWork?: IgnoredWork
): DisplayRule[] {
  return [
    {
      name: "ignored",
      shouldApply: () => !!ignoredWork,
      getMode: () => settings.ignoreSettings.defaultDisplayMode,
    },
    // TODO: Uncomment when in progress settings are added
    // {
    //   name: "in progress",
    //   shouldApply: () => !!inProgressWork,
    //   getMode: () => settings.inProgressSettings.defaultDisplayMode,
    // },
    {
      name: "reread worthy",
      shouldApply: () => !!readWork?.rereadWorthy,
      getMode: () => settings.readSettings.rereadWorthyDisplayMode,
    },
    {
      name: "read (default)",
      shouldApply: () => !!readWork,
      getMode: () => settings.readSettings.defaultDisplayMode,
    },
    {
      name: "read (completed)",
      shouldApply: () =>
        !!readWork && readWork.finishedStatus === FinishedStatus.COMPLETED,
      getMode: () => settings.readSettings.completedDisplayMode,
    },
    {
      name: "read (abandoned)",
      shouldApply: () =>
        !!readWork && readWork.finishedStatus === FinishedStatus.ABANDONED,
      getMode: () => settings.readSettings.abandonedDisplayMode,
    },
  ];
}
