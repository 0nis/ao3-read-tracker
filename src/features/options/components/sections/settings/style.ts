export function getStyles(prefix: string): string {
  return `
    .${prefix}__settings__field__wrapper {
      margin: 1em 0;
    }

    .${prefix}__settings__field {
      padding: 8px 0;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__settings__field__label__wrapper {
      max-width: 70%;
    }

    .${prefix}__settings__field label {
      font-weight: 600;
    }

    .${prefix}__settings__field input, 
    .${prefix}__settings__field select, 
    .${prefix}__settings__field textarea {
      width: auto !important;
    }

    .${prefix}__settings__field select {
      font: 100% 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont';
      border: 1px solid #bbb;
      box-shadow: inset 0 1px 2px #ccc;
    }

    .${prefix}__settings__field__description {
      color: #666;
      font-size: 0.95em;
      margin-top: 6px;
    }

    .${prefix}__settings__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 12px;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .${prefix}__settings__field__label__wrapper {
          max-width: 100%;
      }

      .${prefix}__settings__field {
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
      }
    }
    `;
}
