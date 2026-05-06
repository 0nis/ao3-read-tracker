import {
  VerticalPlacement,
  DisplayMode,
  ExtensionModule,
} from "../enums/settings";
import {
  SymbolId,
  SymbolDisplayMode,
  SymbolRenderMode,
  SymbolFallbackType,
} from "../enums/symbols";

export interface FinishedSettings {
  id: string;
  simpleModeEnabled: boolean;
  displayModes: {
    default: DisplayMode;
    rereadWorthy: DisplayMode;
    statusCompleted: DisplayMode;
    statusDropped: DisplayMode;
    statusDormant: DisplayMode;
  };
  symbolDisplayMode: SymbolDisplayMode;
  buttonPlacement: VerticalPlacement;
}

export interface InProgressSettings {
  id: string;
  simpleModeEnabled: boolean;
  displayModes: {
    default: DisplayMode;
    statusActive: DisplayMode;
    statusPaused: DisplayMode;
    statusWaiting: DisplayMode;
    newChaptersAvailable: DisplayMode;
  };
  symbolDisplayMode: SymbolDisplayMode;
  buttonPlacements: {
    startReading: VerticalPlacement;
    updateReadProgress: VerticalPlacement;
  };
}

export interface IgnoreSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  buttonPlacement: VerticalPlacement;
}

export interface GeneralSettings {
  id: string;
  activeModules: {
    [ExtensionModule.FINISHED]: boolean;
    [ExtensionModule.IN_PROGRESS]: boolean;
    [ExtensionModule.IGNORED]: boolean;
  };
  nativeMarkAsReadReplacementLabel: string;
}

export interface DisplayModeSettings {
  id: string;
  priorities: Record<DisplayMode, number>;
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
  displayModeSettings: DisplayModeSettings;
};
