export function getStyles(prefix: string) {
  return `
    .${prefix} {
      display: flex;
      flex-direction: row;
      gap: 0.5em;
      align-items: center;
    }
    
    .${prefix}-preview {
      height: 1.8em;
    }
  `;
}
