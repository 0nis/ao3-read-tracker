import { DEFAULT_SYMBOL_SIZE_EM } from "./global";
import { VerticalPlacement, DisplayMode } from "../enums/settings";
import { SettingsType } from "../enums/settings";
import {
  SymbolDisplayMode,
  SymbolFallbackType,
  SymbolRenderMode,
} from "../enums/symbols";
import {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  FinishedSettings,
  SymbolSettings,
  DisplayModeSettings,
} from "../types/settings";

export const DEFAULT_FINISHED_SETTINGS: FinishedSettings = {
  id: SettingsType.FINISHED,
  simpleModeEnabled: false,
  displayModes: {
    default: DisplayMode.COLLAPSE_GENTLE,
    rereadWorthy: DisplayMode.DEFAULT,
    statusCompleted: DisplayMode.COLLAPSE_GENTLE,
    statusDropped: DisplayMode.COLLAPSE_GENTLE,
    statusDormant: DisplayMode.COLLAPSE_GENTLE,
  },
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
  buttonPlacement: VerticalPlacement.TOP,
};

export const DEFAULT_IN_PROGRESS_SETTINGS: InProgressSettings = {
  id: SettingsType.IN_PROGRESS,
  simpleModeEnabled: false,
  displayModes: {
    default: DisplayMode.COLLAPSE_GENTLE,
    statusActive: DisplayMode.COLLAPSE_GENTLE,
    statusPaused: DisplayMode.COLLAPSE_GENTLE,
    statusWaiting: DisplayMode.COLLAPSE_GENTLE,
    newChaptersAvailable: DisplayMode.DEFAULT,
  },
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
  buttonPlacements: {
    startReading: VerticalPlacement.TOP,
    updateReadProgress: VerticalPlacement.BOTTOM,
  },
};

export const DEFAULT_IGNORE_SETTINGS: IgnoreSettings = {
  id: SettingsType.IGNORE,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_AGGRESSIVE,
  buttonPlacement: VerticalPlacement.TOP,
};

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  id: SettingsType.GENERAL,
  finishedModuleEnabled: true,
  inProgressModuleEnabled: true,
  ignoredModuleEnabled: true,
  nativeMarkAsReadReplacementLabel: "",
};

export const DEFAULT_DISPLAYMODE_SETTINGS: DisplayModeSettings = {
  id: SettingsType.DISPLAY_MODES,
  priorities: {
    [DisplayMode.DEFAULT]: 100,
    [DisplayMode.HIDE]: 90,
    [DisplayMode.COLLAPSE_GENTLE]: 70,
    [DisplayMode.COLLAPSE_AGGRESSIVE]: 80,
  },
};

export const DEFAULT_SYMBOL_SETTINGS: SymbolSettings = {
  id: SettingsType.SYMBOLS,
  enabled: true,
  renderMode: SymbolRenderMode.AUTO,
  fallbackType: SymbolFallbackType.HIDDEN,
  size: DEFAULT_SYMBOL_SIZE_EM,
  emojiScalingEnabled: true,
  emojiScaleFactor: 0.83,
};
