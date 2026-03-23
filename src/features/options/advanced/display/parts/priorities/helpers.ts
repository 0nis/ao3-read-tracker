import { DisplayMode } from "../../../../../../enums/settings";

export function toArray(modes: Record<DisplayMode, number>): DisplayMode[] {
  return Object.entries(modes)
    .sort((a, b) => b[1] - a[1])
    .map(([mode]) => mode as DisplayMode);
}

export function toPriorities(
  modes: DisplayMode[],
): Record<DisplayMode, number> {
  return Object.fromEntries(
    modes.map((mode, index) => [mode, modes.length - 1 - index]),
  ) as Record<DisplayMode, number>;
}
