import { SymbolId, SymbolType } from "../enums/symbols";

export interface SymbolRecord {
  id: SymbolId;
  type: SymbolType;
  label: string;
  symbol?: string;
  imageUrl?: string;
}
