import { SymbolId, SymbolType } from "@enums";

export interface SymbolRecord {
  id: string;
  type: SymbolType;
  label: string;
  text?: string;
  imgUrl?: string;
}

export type SymbolData = Record<SymbolId, SymbolRecord>;
