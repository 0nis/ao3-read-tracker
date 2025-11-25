export function getStyles(prefix: string): string {
  return `
    .${prefix}__list__container {
      max-height: 400px;
      overflow-y: scroll;
    }

    .${prefix}__list__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8em 0;
      margin: 0;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__list__row:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .${prefix}__list__row:focus {
      outline: 2px solid #09f;
      outline-offset: 2px;
    }

    .${prefix}__list__row__content {
      display: flex;
      gap: 1em;
      align-items: center;
    }

    .${prefix}__list__row__title a {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border-bottom: 1px dotted #999;
    }

    .${prefix}__list__row__title a:hover {
      color: #900;
      border-bottom: 1px solid;
    }

    .${prefix}__list__row__date {
      color: #666;
      font-size: 0.8em;
    }

    .${prefix}__list__row__actions {
      display: flex;
      gap: 6px;
      margin-left: 1em;
    }
    
    .${prefix}__pagination__controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
      margin-top: 12px;
    }

    .${prefix}__pagination__input {
      width: 3em;
    }

    @media (max-width: 800px) {
      .${prefix}__pagination__controls {
        justify-content: space-between;
      }
    }
  `;
}
