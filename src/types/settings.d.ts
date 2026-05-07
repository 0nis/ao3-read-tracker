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
import { WorkState } from "../enums/works";

export type ModuleState = {
  enabled: boolean;
};
export type ModuleStates = Record<ExtensionModule, ModuleState>;

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
  modules: ModuleStates;
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

interface ActionLabelSet {
  simple: { on: string; off: string };
  advanced: { on: string; off: string };
}

export interface LabelSettings {
  id: string;
  actions: {
    [WorkState.FINISHED]: ActionLabelSet;
    [WorkState.IN_PROGRESS]: ActionLabelSet & {
      updateReadProgress: string;
    };
    [WorkState.IGNORED]: ActionLabelSet;
  };
  stateIndicators: {
    [WorkState.FINISHED]: string;
    [WorkState.IN_PROGRESS]: string;
    [WorkState.IGNORED]: string;
  };
  misc: {
    nativeMarkAsReadReplacement: string;
  };
}

export type SettingsData = {
  finishedSettings: FinishedSettings;
  inProgressSettings: InProgressSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
  symbolSettings: SymbolSettings;
  displayModeSettings: DisplayModeSettings;
  labelSettings: LabelSettings;
};
