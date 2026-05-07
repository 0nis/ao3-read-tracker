import { DEFAULT_SYMBOL_SIZE_EM } from "./global";
import {
  VerticalPlacement,
  DisplayMode,
  ExtensionModule,
} from "../enums/settings";
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
  LabelSettings,
} from "../types/settings";
import { WorkState } from "../enums/works";

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
  modules: {
    [ExtensionModule.FINISHED]: {
      enabled: true,
    },
    [ExtensionModule.IN_PROGRESS]: {
      enabled: true,
    },
    [ExtensionModule.IGNORED]: {
      enabled: true,
    },
  },
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

export const DEFAULT_LABEL_SETTINGS: LabelSettings = {
  id: SettingsType.LABELS,
  actions: {
    [WorkState.FINISHED]: {
      simple: {
        off: "Mark as Read",
        on: "Mark as Unread",
      },
      advanced: {
        off: "Mark as Read",
        on: "Edit Read Info",
      },
    },
    [WorkState.IN_PROGRESS]: {
      simple: {
        off: "Start Reading",
        on: "Stop Reading",
      },
      advanced: {
        off: "Start Reading",
        on: "Edit Read Progress",
      },
      updateReadProgress: "Update Read Progress",
    },
    [WorkState.IGNORED]: {
      simple: {
        off: "Ignore",
        on: "Unignore",
      },
      advanced: {
        off: "Ignore",
        on: "Edit Ignore Info",
      },
    },
  },
  stateIndicators: {
    [WorkState.FINISHED]: "Marked as read on %finished_at%",
    [WorkState.IN_PROGRESS]:
      "Still reading as of %started_at% (chapter %last_read_chapter%/%latest_chapter%)",
    [WorkState.IGNORED]: "Marked as ignored on %ignored_at%",
  },
  misc: {
    nativeMarkAsReadReplacement: "",
  },
};
