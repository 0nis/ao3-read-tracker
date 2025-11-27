import { ButtonPlacement, DisplayMode, SettingsType } from "@enums";
import { GeneralSettings, IgnoreSettings, ReadSettings } from "@types";

export const DEFAULT_READ_SETTINGS: ReadSettings = {
  id: SettingsType.READ,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  stillReadingDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  rereadWorthyDisplayMode: DisplayMode.COLLAPSE_GENTLE,
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
