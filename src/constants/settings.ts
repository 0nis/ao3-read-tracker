import { VerticalPlacement, DisplayMode } from "../enums/settings";
import { SettingsType } from "../enums/settings";
import { SymbolDisplayMode } from "../enums/symbols";
import {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  FinishedSettings,
} from "../types/settings";

export const DEFAULT_FINISHED_SETTINGS: FinishedSettings = {
  id: SettingsType.FINISHED,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  rereadWorthyDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  completedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  droppedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  dormantDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
};

export const DEFAULT_IN_PROGRESS_SETTINGS: InProgressSettings = {
  id: SettingsType.IN_PROGRESS,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  activeDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  pausedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  waitingDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
  updateButtonPlacement: VerticalPlacement.BOTTOM,
};

export const DEFAULT_IGNORE_SETTINGS: IgnoreSettings = {
  id: SettingsType.IGNORE,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_AGGRESSIVE,
};

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  id: SettingsType.GENERAL,
  hideSymbols: false,
  buttonPlacement: VerticalPlacement.TOP,
  replaceMarkForLaterLabel: true,
  markForLaterReplacementLabel: "Finished",
};
