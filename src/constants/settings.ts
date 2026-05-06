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
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  rereadWorthyDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  completedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  droppedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  dormantDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
  buttonPlacement: VerticalPlacement.TOP,
};

export const DEFAULT_IN_PROGRESS_SETTINGS: InProgressSettings = {
  id: SettingsType.IN_PROGRESS,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  activeDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  pausedDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  waitingDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  newChaptersAvailableDisplayMode: DisplayMode.DEFAULT,
  symbolDisplayMode: SymbolDisplayMode.STATE_ONLY,
  buttonPlacement: VerticalPlacement.TOP,
  updateButtonPlacement: VerticalPlacement.BOTTOM,
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
    [DisplayMode.DEFAULT]: 70,
    [DisplayMode.HIDE]: 100,
    [DisplayMode.COLLAPSE_GENTLE]: 80,
    [DisplayMode.COLLAPSE_AGGRESSIVE]: 90,
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
