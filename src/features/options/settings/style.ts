export function getStyles(prefix: string): string {
  return `
    .${prefix}__field-wrapper {
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

    .${prefix}__field-label-wrapper {
      max-width: 70%;
    }

    .${prefix}__field label {
      font-weight: 600;
    }

    .${prefix}__field input, 
    .${prefix}__field select, 
    .${prefix}__field textarea {
      width: auto !important;
    }

    .${prefix}__field-description {
      opacity: 0.8;
      font-size: 0.95em;
      margin-top: 6px;
    }

    .${prefix}__field-input {
      align-self: center;
    }

    .${prefix}__group {
      margin: 1em 0;
      padding: 1em 0;
      background: transparent;
      box-shadow: none;
      border-radius: 8px;
      border-left: 0;
      border-right: 0;
    }

    .${prefix}__group .${prefix}__field-description {
      margin-top: 0;
    }

    .${prefix}__group-label {
      height: auto;
      width: auto;
      font-size: 1.1em;
      font-weight: 700;
      opacity: 1;
      padding-right: .5em;
    }

    .${prefix}__group label {
      font-weight: 500;
    }

    .${prefix}__group .${prefix}__field {
      flex-wrap: nowrap;
    }

    .${prefix}__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 12px;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .${prefix}__field-label-wrapper--short {
        max-width: 80% !important;
      }

      .${prefix}__field-label-wrapper {
        max-width: 100%;
      }

      .${prefix}__field {
        flex-wrap: wrap;
        align-items: center;
        gap: 0;
      }

      .${prefix}__group .${prefix}__field {
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }
    }
    `;
}
