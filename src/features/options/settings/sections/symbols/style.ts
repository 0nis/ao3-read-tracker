export function getStyles(prefix: string): string {
  return `
    .${prefix}__grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
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
      min-width: 14em;
    }

    .${prefix}__block-title {
      display: flex;
      gap: .5em;
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
      align-items: center;
    }

    .${prefix}__block__field-input--upload button {
      background: transparent;
    }

    .${prefix}__block-bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .${prefix}__block-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: .4em;
    }

    .${prefix}__block-feedback {
      flex: 1 1 auto;
      width: 0;
      margin: 0;
      font-size: 0.8em;
      font-style: italic;
      padding-right: .5em;
    }
    .${prefix}__block-feedback--success {
      color: #009900;
    }
    .${prefix}__block-feedback--error {
      color: #900;
    }

    @media (max-width: 1100px) {
      .${prefix}__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 800px) {
      .${prefix}__grid {
        grid-template-columns: 1fr;
      }
      .${prefix}__block__field-label {
        width: 33%;
      }
    }
    @media (max-width: 600px) {
      .${prefix}__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 500px) {
      .${prefix}__grid {
        grid-template-columns: 1fr;
      }
      .${prefix}__block__field-label {
        width: 33%;
      }
    }
  `;
}
