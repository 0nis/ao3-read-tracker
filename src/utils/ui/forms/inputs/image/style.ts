export function getStyles(prefix: string) {
  return `
    .${prefix} {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
  `;
}
