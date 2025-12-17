export function getStyles(prefix: string): string {
  return `
    .${prefix}__grid {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      gap: 1em;
    }
    
    .${prefix}__block {
      display: flex;
      flex-direction: column;
      gap: 1em;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: .8em;
      margin: 0;
    }

    .${prefix}__block-title {
      display: flex;
      gap: 1em;
      align-items: center;
      margin: 0;
    }
    
    .${prefix}__block-fields {
      display: flex;
      flex-direction: column;
      gap: .4em;
    }

    .${prefix}__block__field {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      gap: 1em;
      align-items: center;
    }
    
    .${prefix}__block__field-label {
      width: 6em;
    }

    .${prefix}__block__field-input {
      width: 100%;
      margin: 0 !important;
      box-sizing: border-box;
    }

    .${prefix}__block__field-input--upload {
      position: relative;
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 0.5em;
      align-items: center;
    }
    
    .${prefix}__block__field-input--upload-group {
      display: flex;
      flex-direction: row;
      gap: 0.5em;
    }

    .${prefix}__block__field-input--upload button {
      background: transparent;
    }

    .${prefix}__block-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: .4em;
    }

    @media (max-width: 600px) {
      .${prefix}__block {
        width: 44%;
      }
    }

    @media (max-width: 500px) {
      .${prefix}__block {
        width: 100%;
      }
      .${prefix}__block__field-label {
        width: 33%;
      }
    }
  `;
}
