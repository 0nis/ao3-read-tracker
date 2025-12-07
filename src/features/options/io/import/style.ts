export function getStyles(prefix: string): string {
  return `
    .${prefix}__import__expandable-secondary {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 11em;
        box-sizing: border-box;
        position: absolute;
        top: 2.411em;
        left: 0;
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
