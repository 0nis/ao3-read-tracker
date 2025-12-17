import { SymbolRecord } from "../../../../../types/symbols";

export function getLabelFromType(type: keyof SymbolRecord): string {
  switch (type) {
    case "label":
      return "Label";
    case "priority":
      return "Priority";
    case "emoji":
      return "Emoji";
    case "imgBlob":
      return "Image";
  }
  return "";
}
