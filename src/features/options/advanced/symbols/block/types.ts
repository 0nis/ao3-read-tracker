import type { SymbolId } from "../../../../../enums/symbols";
import type { SymbolData, SymbolRecord } from "../../../../../types/symbols";

export interface BlockField {
  id: SymbolId;
  type: keyof SymbolRecord;
  element: HTMLElement;
}

export type State = {
  file?: Blob;
};

export type BlockContext = {
  id: SymbolId;
  record: SymbolRecord;
  state: State;
  fields?: BlockField[];
  symbols?: SymbolData;
  feedbackEl?: HTMLElement;
};
