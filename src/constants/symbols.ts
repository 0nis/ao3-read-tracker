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
    id: SymbolId.IN_PROGRESS,
    type: SymbolType.TEXT,
    label: "Marked as in progress",
    text: "⏳",
  },
  {
    id: SymbolId.IGNORED,
    type: SymbolType.TEXT,
    label: "Marked as ignored",
    text: "🚫",
  },
  {
    id: SymbolId.REREAD_WORTHY,
    type: SymbolType.TEXT,
    label: "Marked as re-read worthy",
    text: "🔁",
  },
  {
    id: SymbolId.TIMES_READ,
    type: SymbolType.TEXT,
    label: "Times read",
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
