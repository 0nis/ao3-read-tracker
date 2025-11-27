import { SymbolId, SymbolType } from "../enums/symbols";
import { SymbolRecord } from "../types/symbols";

export const DEFAULT_SYMBOL_RECORDS: SymbolRecord[] = [
  {
    id: SymbolId.READ,
    type: SymbolType.TEXT,
    label: "Marked as read",
    text: "✔️",
  },
  {
    id: SymbolId.IGNORED,
    type: SymbolType.TEXT,
    label: "Marked as ignored",
    text: "🚫",
  },
  {
    id: SymbolId.READING,
    type: SymbolType.TEXT,
    label: "Still reading",
    text: "📖",
  },
  {
    id: SymbolId.REREAD_WORTHY,
    type: SymbolType.TEXT,
    label: "Marked as re-read worthy",
    text: "🔁",
  },
  {
    id: SymbolId.READ_COUNT,
    type: SymbolType.TEXT,
    label: "Read count",
    text: "📚",
  },
  {
    id: SymbolId.NEW_CHAPTERS_AVAILABLE,
    type: SymbolType.TEXT,
    label: "New chapters available",
    text: "‼️",
  },
  {
    id: SymbolId.LINK,
    type: SymbolType.TEXT,
    label: "Link",
    text: "↗",
  },
  {
    id: SymbolId.DELETE,
    type: SymbolType.TEXT,
    label: "Delete",
    text: "🗑︎",
  },
  {
    id: SymbolId.EXTENSION,
    type: SymbolType.TEXT,
    label: "Extension",
    text: "🧩",
  },
];
