export function getStyles(prefix: string): string {
  return `
    .${prefix}__list {
      display: flex;
      flex-direction: column;
      gap: .5em;
    }

    .${prefix}__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: .6em .8em;
      background: #fff;
      transition: transform 200ms ease;
    }

    .${prefix}__row-content {
      display: flex;
      gap: 1em;
    }

    .${prefix}__row-label {
      font-size: 0.95em;
    }

    .${prefix}__row-controls {
      display: flex;
      gap: .3em;
    }

    .${prefix}__row-btn {
      cursor: pointer;
      border: 1px solid #ccc;
      background: #f5f5f5;
      border-radius: 3px;
      padding: .2em .5em;
    }

    .${prefix}__row-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
  `;
}
