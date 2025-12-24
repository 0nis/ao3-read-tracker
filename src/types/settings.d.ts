import { VerticalPlacement, DisplayMode } from "../enums/settings";
import { SymbolDisplayMode } from "../enums/symbols";

export interface FinishedSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  rereadWorthyDisplayMode: DisplayMode;
  completedDisplayMode: DisplayMode;
  droppedDisplayMode: DisplayMode;
  dormantDisplayMode: DisplayMode;
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
  nativeMarkAsReadReplacementLabel: string;
}

export type SettingsData = {
  finishedSettings: FinishedSettings;
  inProgressSettings: InProgressSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
};
