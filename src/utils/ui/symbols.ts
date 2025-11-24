export type IndicatorSymbol = {
  id: string;
  symbol: string;
  label: string;
};

export const SYMBOLS_MAP: IndicatorSymbol[] = [
  {
    id: "read",
    symbol: "✔️",
    label: "Marked as read",
  },
  {
    id: "ignored",
    symbol: "🚫",
    label: "Marked as ignored",
  },
  {
    id: "still-reading",
    symbol: "📖",
    label: "Still reading",
  },
  {
    id: "reread-worthy",
    symbol: "🔁",
    label: "Marked as re-read worthy",
  },
  {
    id: "read-count",
    symbol: "📚",
    label: "Read count",
  },
  {
    id: "new-chapters",
    symbol: "‼️",
    label: "New chapters available",
  },
  {
    id: "link",
    symbol: "↗",
    label: "External link",
  },
  {
    id: "delete",
    symbol: "🗑︎",
    label: "Delete",
  },
];
