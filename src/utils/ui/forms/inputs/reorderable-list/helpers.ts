export function toArray(modes: Record<string, number>): string[] {
  return Object.entries(modes)
    .sort((a, b) => b[1] - a[1])
    .map(([mode]) => mode);
}

export function toPriorities(modes: string[]): Record<string, number> {
  return Object.fromEntries(
    modes.map((mode, index) => [mode, modes.length - 1 - index]),
  ) as Record<string, number>;
}
