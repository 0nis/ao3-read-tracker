export function getGlobalStyles(prefix: string): string {
  return `
    .${prefix}__hidden {
      display: none !important;
    }
  `;
}
