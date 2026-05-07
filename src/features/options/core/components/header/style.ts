export function getStyles(prefix: string): string {
  return `
    .${prefix}-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .${prefix}-actions {
      display: flex;
      gap: 8px;
    }

    .${prefix}-actions li {
      position: relative;
      display: inline-block;
      margin: 0;
      padding: 0;
    }

    .${prefix}-actions li button {
      margin: 0;
    }

    .${prefix}-warning {
      margin-top: 0.5em;
      margin-bottom: 0;
      opacity: 0.8;
      font-size: 0.90em;
      font-style: italic;
      color: #900;
    }

    @media (max-width: 600px) {
      .${prefix}-actions {
        display: none;
      }
    }
  `;
}
