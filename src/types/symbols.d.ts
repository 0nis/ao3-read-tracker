import { SymbolId, SymbolRenderMode, SymbolFallback } from "../enums/symbols";

export interface SymbolRecord {
  id: string;
  label: string;
  priority: number;
  emoji?: string;
  imgBlob?: Blob;
}

export type SymbolData = Record<SymbolId, SymbolRecord>;

export interface SymbolSettings {
  id: string;
  enabled: boolean;
  renderMode: SymbolRenderMode;
  fallback: SymbolFallback;
  size: string;
}
