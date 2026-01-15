import { VerticalPlacement, DisplayMode } from "../enums/settings";
import {
  SymbolId,
  SymbolDisplayMode,
  SymbolRenderMode,
  SymbolFallbackType,
} from "../enums/symbols";

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
  nativeMarkAsReadReplacementLabel: string;
}

export interface DisplayModeSettings {
  id: string;
  priorities: {
    [id: DisplayMode]: number;
  };
}

export interface SymbolSettings {
  id: string;
  enabled: boolean;
  renderMode: SymbolRenderMode;
  fallbackType: SymbolFallback;
  size: number;
  emojiScalingEnabled: boolean;
  emojiScaleFactor: number;
}

export type SettingsData = {
  finishedSettings: FinishedSettings;
  inProgressSettings: InProgressSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
  symbolSettings: SymbolSettings;
};
