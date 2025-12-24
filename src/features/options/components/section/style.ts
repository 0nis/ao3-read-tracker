export function getStyles(prefix: string): string {
  return `
    .${prefix} {
      background: transparent;
      padding: 0 0 10px 0;
    }

    .${prefix}-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .${prefix}-title {
      margin: 0;
    }

    .${prefix}-description {
      opacity: 0.8;
      font-size: 0.95em;
    }

    .${prefix}-description ul {
      list-style: initial; 
      margin: 0.5em 0 0.5em 1.5em;
    }
      
    .${prefix}-description li {
      list-style: initial;
      margin: 0.25em 0;
    }
  `;
}
