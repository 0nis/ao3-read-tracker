import { DisplayMode } from "../../../../../../enums/settings";

export interface DisplayModeRowOptions {
  mode: DisplayMode;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export interface DisplayModeRow {
  el: HTMLElement;
  setIndex: (index: number) => void;
  setDisabled: (isFirst: boolean, isLast: boolean) => void;
}
