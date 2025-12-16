import { SymbolId, SymbolType } from "../enums/symbols";
import { SymbolRecord } from "../types/symbols";

export const DEFAULT_SYMBOL_RECORDS: SymbolRecord[] = [
  {
    id: SymbolId.FINISHED,
    type: SymbolType.TEXT,
    label: "Finished",
    text: "📘",
  },
  {
    id: SymbolId.IN_PROGRESS,
    type: SymbolType.TEXT,
    label: "In progress",
    text: "📖",
  },
  {
    id: SymbolId.IGNORED,
    type: SymbolType.TEXT,
    label: "Ignored",
    text: "🚫",
  },
  {
    id: SymbolId.REREAD_WORTHY,
    type: SymbolType.TEXT,
    label: "Reread worthy",
    text: "⭐",
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
    text: "🔔",
  },
  {
    id: SymbolId.STATUS_COMPLETED,
    type: SymbolType.TEXT,
    label: "Status: Completed",
    text: "🟢",
  },
  {
    id: SymbolId.STATUS_DROPPED,
    type: SymbolType.TEXT,
    label: "Status: Dropped",
    text: "🔴",
  },
  {
    id: SymbolId.STATUS_DORMANT,
    type: SymbolType.TEXT,
    label: "Status: Dormant",
    text: "🟠",
  },
  {
    id: SymbolId.STATUS_READING_ACTIVE,
    type: SymbolType.TEXT,
    label: "Status: Actively Reading",
    text: "▶️",
  },
  {
    id: SymbolId.STATUS_READING_WAITING,
    type: SymbolType.TEXT,
    label: "Status: Waiting to Read",
    text: "⏸️",
  },
  {
    id: SymbolId.STATUS_READING_PAUSED,
    type: SymbolType.TEXT,
    label: "Status: Paused Reading",
    text: "⏹️",
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
    id: SymbolId.HAMBURGER,
    type: SymbolType.TEXT,
    label: "Hamburger Menu",
    text: "☰",
  },
  {
    id: SymbolId.CLOSE,
    type: SymbolType.TEXT,
    label: "Closed",
    text: "✕",
  },
];
