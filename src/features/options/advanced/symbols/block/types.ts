import type { SymbolId } from "../../../../../enums/symbols";
import type { SymbolRecord } from "../../../../../types/symbols";

export interface BlockField {
  id: SymbolId;
  type: keyof SymbolRecord;
  element: HTMLElement;
}
