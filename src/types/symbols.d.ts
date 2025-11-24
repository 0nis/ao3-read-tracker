import { SymbolId, SymbolType } from "../enums/symbols";

export interface SymbolRecord {
  id: string;
  type: SymbolType;
  label: string;
  symbol?: string;
  imageUrl?: string;
}
