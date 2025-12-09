export function getStyles(prefix: string): string {
  return `
    .${prefix}__container {
      height: 400px;
      overflow-y: scroll;
      opacity: 1;
      transition: opacity 120ms linear;
    }

    .${prefix}__container--loading {
      opacity: 0;
    }

    .${prefix}__options-wrapper {
      top: -.4em;
    }

    .${prefix}__options-panel {
      align-items: stretch;
      top: 2.411em;
    }

    .${prefix}__options-item {
      display: flex;
      justify-content: space-between;
      gap: 1em;
      white-space: nowrap;
      align-items: center;
    }
    .${prefix}__options-item select {
      margin: 0;
      min-width: auto;
    }

    .${prefix}__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8em 0;
      margin: 0;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__row--empty {
      text-align: center;
      opacity: 0.8;
      font-style: italic;
      padding: 2em 0;
    }

    .${prefix}__row:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .${prefix}__row:focus {
      outline: 2px solid #09f;
      outline-offset: 2px;
    }

    .${prefix}__row-content {
      display: flex;
      gap: 1em;
      align-items: center;
      width: 100%;
    }

    .${prefix}__row-title {
      margin: 0;
      min-width: 33%;
      white-space: normal;
    }

    .${prefix}__row-date {
      opacity: 0.6;
      font-size: 0.8em;
      white-space: nowrap;
    }

    .${prefix}__row-main {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }

    .${prefix}__row-main--text {
      margin: 0;
      font-style: italic;
      opacity: 0.8;
    }

    .${prefix}__row-main--info {
      display: flex;
      align-items: center;
      gap: 1em;
    }

    .${prefix}__row-main--info--symbols {
      display: flex;
      gap: 4px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .${prefix}__row-main--info--symbols__item {
      cursor: default;
      margin: 0 !important;
    }

    .${prefix}__row-main--info--status {
      margin: 0;
    }

    .${prefix}__row-actions {
      display: flex;
      gap: 6px;
      margin-left: 1em;
    }
    
    .${prefix}-pagination__controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
      margin-top: 12px;
    }

    .${prefix}-pagination__controls-input {
      width: 3em;
    }

    @media (max-width: 800px) {
      .${prefix}__row-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: max-content;
        gap: 0;
        align-items: flex-start;
      }

      .${prefix}-pagination__controls {
        justify-content: space-between;
      }
    }

    @media (max-width: 400px) {
      .${prefix}__row-main--info {
        flex-wrap: wrap;
        gap: 0.5em;
      }

      .${prefix}__row-main--info--status {
        font-size: 0.8em;
      }
    }
  `;
}
