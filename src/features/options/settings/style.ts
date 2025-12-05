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

    .${prefix}__settings__field__description {
      opacity: 0.8;
      font-size: 0.95em;
      margin-top: 6px;
    }

    .${prefix}__settings__group {
      margin: 1em 0;
      padding: 1em 1.25em;
      border-radius: 8px;
      background: transparent;
      box-shadow: none;
    }

    .${prefix}__settings__group .${prefix}__settings__field__description {
      margin-top: 0;
    }

    .${prefix}__settings__group__label {
      height: auto;
      width: auto;
      font-size: 1.1em;
      font-weight: 700;
      opacity: 1;
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

      .${prefix}__settings__group .${prefix}__settings__field {
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }
    }
    `;
}
