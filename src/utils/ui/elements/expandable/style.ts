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
      z-index: 100;
    }

    .${prefix}-panel--left {
      left: 0;
    }

    .${prefix}-panel--right {
      right: 0;
    }
  `;
}
