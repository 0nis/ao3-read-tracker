export enum SymbolId {
  FINISHED = "finished",
  IGNORED = "ignored",
  IN_PROGRESS = "in_progress",
  REREAD_WORTHY = "reread_worthy",
  TIMES_READ = "times_read",
  STATUS_COMPLETED = "status_completed",
  STATUS_DROPPED = "status_dropped",
  STATUS_DORMANT = "status_dormant",
  STATUS_READING_ACTIVE = "status_reading_active",
  STATUS_READING_WAITING = "status_reading_waiting",
  STATUS_READING_PAUSED = "status_reading_paused",
  NEW_CHAPTERS_AVAILABLE = "new_chapters_available",
  LINK = "link",
  DELETE = "delete",
  HAMBURGER = "hamburger",
  CLOSE = "closed",
  CLEAR = "clear",
}

export enum SymbolRenderMode {
  AUTO = "auto",
  EMOJI = "emoji",
  IMAGE = "image",
}

export enum SymbolDisplayMode {
  STATE_ONLY = "state_only",
  STATUS_ONLY = "status_only",
  BOTH = "both",
  NONE = "none",
}

export enum SymbolFallback {
  LABEL = "label",
  QUESTION_MARK = "question_mark",
  HIDDEN = "hidden",
}
