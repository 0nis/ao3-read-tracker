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
      padding: 1em;
      margin: 0;
    }

    .${prefix}__block-title {
      display: flex;
      gap: 1em;
      align-items: center;
      margin: 0;
    }

    .${prefix}__block__field {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      gap: 1em;
    }
    
    .${prefix}__block__field-label {
        
    }

    .${prefix}__block__field-input {
      width: auto;
      margin: 0 !important;
    }
  `;
}
