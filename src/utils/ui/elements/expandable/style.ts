export function getStyles(prefix: string): string {
  return `
    .${prefix}-wrapper {
      position: relative;
    }

    .${prefix}-trigger {
      cursor: pointer;
    }

    .${prefix}-panel {
      display: flex;
      flex-direction: column;
      position: absolute;
      box-sizing: border-box;
    }

    .${prefix}-panel--left {
      left: 0;
    }

    .${prefix}-panel--right {
      right: 0;
    }
  `;
}
