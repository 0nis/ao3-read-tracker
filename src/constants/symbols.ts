import { SymbolId, SymbolType } from "../enums/symbols";
import { SymbolRecord } from "../types/symbols";

export const DEFAULT_SYMBOL_RECORDS: SymbolRecord[] = [
  {
    id: SymbolId.READ,
    type: SymbolType.TEXT,
    label: "Marked as read",
    symbol: "✔️",
  },
  {
    id: SymbolId.IGNORED,
    type: SymbolType.TEXT,
    label: "Marked as ignored",
    symbol: "🚫",
  },
  {
    id: SymbolId.READING,
    type: SymbolType.TEXT,
    label: "Still reading",
    symbol: "📖",
  },
  {
    id: SymbolId.REREAD_WORTHY,
    type: SymbolType.TEXT,
    label: "Marked as re-read worthy",
    symbol: "🔁",
  },
  {
    id: SymbolId.READ_COUNT,
    type: SymbolType.TEXT,
    label: "Read count",
    symbol: "📚",
  },
  {
    id: SymbolId.NEW_CHAPTERS_AVAILABLE,
    type: SymbolType.TEXT,
    label: "New chapters available",
    symbol: "‼️",
  },
  {
    id: SymbolId.LINK,
    type: SymbolType.TEXT,
    label: "Link",
    symbol: "↗",
  },
  {
    id: SymbolId.DELETE,
    type: SymbolType.TEXT,
    label: "Delete",
    symbol: "🗑︎",
  },
];
