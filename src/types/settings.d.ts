import { VerticalPlacement, DisplayMode } from "../enums/settings";
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

export interface InProgressSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  activeDisplayMode: DisplayMode;
  pausedDisplayMode: DisplayMode;
  waitingDisplayMode: DisplayMode;
  symbolDisplayMode: SymbolDisplayMode;
  updateButtonPlacement: VerticalPlacement;
}

export interface IgnoreSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
}

export interface GeneralSettings {
  id: string;
  hideSymbols: boolean;
  buttonPlacement: VerticalPlacement;
  replaceMarkForLaterLabel: boolean;
  markForLaterReplacementLabel: string;
}

export type SettingsData = {
  readSettings: ReadSettings;
  inProgressSettings: InProgressSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
};
