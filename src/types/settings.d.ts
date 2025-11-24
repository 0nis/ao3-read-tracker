import { ButtonPlacement, DisplayMode } from "../enums/settings";

export interface ReadSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  stillReadingDisplayMode: DisplayMode;
  rereadWorthyDisplayMode: DisplayMode;
}

export interface IgnoreSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
}

export interface GeneralSettings {
  id: string;
  hideSymbols: boolean;
  buttonPlacement: ButtonPlacement;
  replaceMarkForLaterText: boolean;
  markForLaterReplacementLabel: string;
}

export type SettingsData = {
  readSettings: ReadSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
};
