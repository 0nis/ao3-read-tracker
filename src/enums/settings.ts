export enum ExtensionModule {
  FINISHED = "finishedModule",
  IN_PROGRESS = "inProgressModule",
  IGNORED = "ignoredModule",
}

export enum DisplayMode {
  DEFAULT = "default",
  HIDE = "hide",
  COLLAPSE_GENTLE = "gentle_collapse",
  COLLAPSE_AGGRESSIVE = "aggressive_collapse",
}

export enum VerticalPlacement {
  TOP = "top",
  BOTTOM = "bottom",
  BOTH = "both",
  NONE = "none",
}

export enum SettingsType {
  FINISHED = "finished_settings",
  IN_PROGRESS = "in_progress_settings",
  IGNORE = "ignore_settings",
  GENERAL = "general_settings",
  SYMBOLS = "symbols_settings",
  DISPLAY_MODES = "display_modes_settings",
  LABELS = "labels_settings",
}
