export function getStyles(prefix: string): string {
  return `
    .${prefix}__list__container {
      height: 400px;
      overflow-y: scroll;
      opacity: 1;
      transition: opacity 120ms linear;
    }

    .${prefix}__list__container--loading {
      opacity: 0;
    }

    .${prefix}__list__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8em 0;
      margin: 0;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__list__row--empty {
      text-align: center;
      opacity: 0.8;
      font-style: italic;
      padding: 2em 0;
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
      width: 100%;
    }

    .${prefix}__list__row__title {
      margin: 0;
      min-width: 33%;
    }

    .${prefix}__list__row__date {
      opacity: 0.6;
      font-size: 0.8em;
    }

    .${prefix}__list__row__main {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }

    .${prefix}__list__row__symbols {
      display: flex;
      gap: 4px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .${prefix}__list__row__text {
      margin: 0.4em 0 0 0;
      font-style: italic;
      opacity: 0.8;
    }

    .${prefix}__list__row__symbols__item {
      cursor: default;
      margin: 0 !important;
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

    @media (max-width: 600px) {
      .${prefix}__list__row__main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: max-content;
        gap: 0;
        align-items: flex-start;
      }

      .${prefix}__pagination__controls {
        justify-content: space-between;
      }
    }
  `;
}
