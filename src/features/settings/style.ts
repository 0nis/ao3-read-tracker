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
    }

    .${prefix}__section {
      background: transparent;
      padding: 0 0 10px 0;
    }

    .${prefix}__section__title {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .${prefix}__field__wrapper {
      margin: 1em 0;
    }

    .${prefix}__field {
      padding: 8px 0;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__field__label__wrapper {
      max-width: 70%;
    }

    .${prefix}__field label {
      font-weight: 600;
    }

    .${prefix}__field input, .${prefix}__field select, .${prefix}__field textarea {
      width: auto !important;
    }

    .${prefix}__field select {
      font: 100% 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont';
      border: 1px solid #bbb;
      box-shadow: inset 0 1px 2px #ccc;
    }

    .${prefix}__field__description {
      color: #666;
      font-size: 0.95em;
      margin-top: 6px;
    }

    .${prefix}__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 12px;
      gap: 8px;
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
        gap: 1em;
      }

      .${prefix}__header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
      }

      .${prefix}__field__label__wrapper {
        max-width: 100%;
      }

      .${prefix}__field {
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
      }
    }
  `;
}
