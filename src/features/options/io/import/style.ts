export function getStyles(prefix: string): string {
  return `
    .${prefix}__import__expandable-secondary {
      align-items: stretch;
      width: 11em;
      top: 2.411em;
    }

    .${prefix}__import__expandable-secondary li {
      width: 100%;
    }

    .${prefix}__import__expandable-secondary li button {
      width: 100%;
      height: min-content;
      box-sizing: border-box;
      margin: 0.2em 0;
      padding: 0.25em;
      white-space: normal;
    }
  `;
}
