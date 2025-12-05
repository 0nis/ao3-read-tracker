import { ButtonPlacement, DisplayMode } from "../enums/settings";
import { SymbolDisplayMode } from "../enums/symbols";

export interface ReadSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  rereadWorthyDisplayMode: DisplayMode;
  completedDisplayMode: DisplayMode;
  abandonedDisplayMode: DisplayMode;
  symbolDisplayMode: SymbolDisplayMode;
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
