import { ButtonPlacement, DisplayMode } from "../enums/settings";
import { SettingsType } from "../enums/settings";
import { SymbolDisplayMode } from "../enums/symbols";
import {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  ReadSettings,
} from "../types/settings";

export const DEFAULT_READ_SETTINGS: ReadSettings = {
  id: SettingsType.READ,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  rereadWorthyDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  completedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  abandonedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
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
};

export const DEFAULT_IGNORE_SETTINGS: IgnoreSettings = {
  id: SettingsType.IGNORE,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_AGGRESSIVE,
};

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  id: SettingsType.GENERAL,
  hideSymbols: false,
  buttonPlacement: ButtonPlacement.TOP,
  replaceMarkForLaterText: true,
  markForLaterReplacementLabel: "Finished",
};
