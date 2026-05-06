export interface ReorderableRowOptions<T> {
  item: T;
  label: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export interface ReorderableRow {
  el: HTMLElement;
  setIndex: (index: number) => void;
  setDisabled: (isFirst: boolean, isLast: boolean) => void;
  setAria: (label: string, index: number, total: number) => void;
}
