import { SymbolId } from "../enums/symbols";
import { SymbolRecord } from "../types/symbols";

/**
 * Priority: higher = earlier in UI
 * Values are only relative; nearby numbers indicate the same "tier"
 */
export const DEFAULT_SYMBOL_RECORDS: SymbolRecord[] = [
  {
    id: SymbolId.FINISHED,
    label: "Finished",
    emoji: "📘",
    priority: 90,
  },
  {
    id: SymbolId.IN_PROGRESS,
    label: "In Progress",
    emoji: "📖",
    priority: 89,
  },
  {
    id: SymbolId.IGNORED,
    label: "Ignored",
    emoji: "🚫",
    priority: 88,
  },
  {
    id: SymbolId.REREAD_WORTHY,
    label: "Reread Worthy",
    emoji: "⭐",
    priority: 100,
  },
  {
    id: SymbolId.TIMES_READ,
    label: "Times Read",
    emoji: "📚",
    priority: 30,
  },
  {
    id: SymbolId.NEW_CHAPTERS_AVAILABLE,
    label: "New Chapters Available",
    emoji: "🔔",
    priority: 20,
  },
  {
    id: SymbolId.STATUS_COMPLETED,
    label: "Status: Completed",
    emoji: "🟢",
    priority: 80,
  },
  {
    id: SymbolId.STATUS_DROPPED,
    label: "Status: Dropped",
    emoji: "🔴",
    priority: 79,
  },
  {
    id: SymbolId.STATUS_DORMANT,
    label: "Status: Dormant",
    emoji: "🟠",
    priority: 78,
  },
  {
    id: SymbolId.STATUS_READING_ACTIVE,
    label: "Status: Actively Reading",
    emoji: "▶️",
    priority: 70,
  },
  {
    id: SymbolId.STATUS_READING_WAITING,
    label: "Status: Waiting to Read",
    emoji: "⏸️",
    priority: 69,
  },
  {
    id: SymbolId.STATUS_READING_PAUSED,
    label: "Status: Paused Reading",
    emoji: "⏹️",
    priority: 68,
  },
  {
    id: SymbolId.LINK,
    label: "Link",
    emoji: "↗",
    priority: 10,
  },
  {
    id: SymbolId.DELETE,
    label: "Delete",
    emoji: "🗑︎",
    priority: 9,
  },
  {
    id: SymbolId.HAMBURGER,
    label: "Hamburger Menu",
    emoji: "☰",
    priority: 8,
  },
  {
    id: SymbolId.CLOSE,
    label: "Closed",
    emoji: "✕",
    priority: 7,
  },
  {
    id: SymbolId.CLEAR,
    label: "Clear",
    emoji: "✕",
    priority: 6,
  },
  {
    id: SymbolId.UP,
    label: "Up",
    emoji: "↑",
    priority: 5,
  },
  {
    id: SymbolId.DOWN,
    label: "Down",
    emoji: "↓",
    priority: 4,
  },
];
