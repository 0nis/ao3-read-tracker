export function getStyles(prefix: string): string {
  return `
    .${prefix}__wrapper {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      margin-top: 12px;
    }

    .${prefix}__nav {
      width: max-content;
      border-right: 1px solid #ddd;
      padding-right: 3em;
    }

    .${prefix}__nav ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .${prefix}__nav li {
      margin: 0.5em 0;
    }

    .${prefix}__nav a {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border-bottom: 0px;
    }

    .${prefix}__nav a:hover {
      color: #900;
      border-bottom: 1px solid;
    }

    .${prefix}__nav a.selected {
      color: #900;
      border-bottom: 1px solid;
    }

    .${prefix}__content {
      flex: 1;
      width: 100%;
    }

    .${prefix}__section {
      background: transparent;
      padding: 0 0 10px 0;
    }

    .${prefix}__section__title {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .${prefix}__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .${prefix}__header__actions {
      display: flex;
      gap: 8px;
    }
    
    .${prefix}__button {
      cursor: pointer;
    }

    .${prefix}__button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .${prefix}__button--danger {
      color: #900 !important;
      border-color: #900 !important;
    }

    @media (max-width: 800px) {
      .${prefix}__wrapper {
        flex-direction: column;
      }

      .${prefix}__nav {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      }

      .${prefix}__nav ul {
        flex-direction: row;
        justify-content: space-between;
        gap: 1em;
        overflow-x: auto;
      }

      .${prefix}__header {
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      .${prefix}__header__title {
        text-align: center;
      }
    }
  `;
}
