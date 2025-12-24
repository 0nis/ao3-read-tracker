export function getStyles(prefix: string): string {
  return `
    .${prefix} {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
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

    @media (max-width: 600px) {
      .${prefix}-actions {
        display: none;
      }
    }
  `;
}
