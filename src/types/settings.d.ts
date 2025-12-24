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
  buttonPlacement: VerticalPlacement;
}

export interface InProgressSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  activeDisplayMode: DisplayMode;
  pausedDisplayMode: DisplayMode;
  waitingDisplayMode: DisplayMode;
  symbolDisplayMode: SymbolDisplayMode;
  buttonPlacement: VerticalPlacement;
  updateButtonPlacement: VerticalPlacement;
}

export interface IgnoreSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  buttonPlacement: VerticalPlacement;
}

export interface GeneralSettings {
  id: string;
  hideSymbols: boolean;
  nativeMarkAsReadReplacementLabel: string;
}

export type SettingsData = {
  finishedSettings: FinishedSettings;
  inProgressSettings: InProgressSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
};
