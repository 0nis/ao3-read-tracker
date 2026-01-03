import { SymbolId } from "../enums/symbols";

export interface SymbolRecord {
  id: string;
  label: string;
  priority: number;
  emoji?: string;
  imgBlob?: Blob;
}

export type SymbolData = Record<SymbolId, SymbolRecord>;
