export function getStyles(prefix: string): string {
  return `
    .${prefix}__field-wrapper {
      margin: 1em 0;
    }

    .${prefix}__field {
      display: grid;
      padding: 8px 0;
      align-items: center;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__field--horizontal {
      grid-template-columns: auto 12em;
      grid-template-rows: 1fr;
      gap: 1em;
    }

    .${prefix}__field--vertical {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      gap: .5em;
    }

    .${prefix}__field-label-wrapper {
      max-width: 70%;
    }

    .${prefix}__field--horizontal .${prefix}__field-input-wrapper {
      display: flex;
      justify-content: flex-end;
    }

    .${prefix}__field label {
      font-weight: 600;
    }

    .${prefix}__field input, 
    .${prefix}__field select, 
    .${prefix}__field textarea {
      width: 100%;
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

    .${prefix}__group[data-collapsible="true"] .${prefix}__group-header {
      cursor: pointer;
      user-select: none;
      border-radius: 8px;
    }

    .${prefix}__group[data-collapsible="true"] .${prefix}__group-header:hover,
    .${prefix}__group[data-collapsible="true"] .${prefix}__group-header:focus-visible {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .${prefix}__group[data-collapsible="true"] .${prefix}__group-fields {
      padding-left: 1em;
      border-left: 1px solid rgba(0, 0, 0, 0.2);
    }

    .${prefix}__group[data-collapsible="true"] .${prefix}__group-label::before {
      content: "▾";
      display: inline-flex;
      margin-right: 0.4em;
      transform-origin: center;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .${prefix}__group[data-collapsible="true"][data-collapsed] .${prefix}__group-label::before {
      transform: rotate(-90deg);
    }

    .${prefix}__group[data-collapsible="true"][data-collapsed] .${prefix}__group-fields {
      display: none;
    }

    .${prefix}__group-label {
      height: auto;
      width: auto;
      font-size: 1.1em;
      font-weight: 700;
      opacity: 1;
      padding-right: .5em;
    }

    .${prefix}__group-fields-labels--bold label {
      font-weight: 600;
    }
    .${prefix}__group-fields-labels--normal label {
      font-weight: 500;
    }

    .${prefix}__group .${prefix}__field {
      flex-wrap: nowrap;
    }

    .${prefix}__actions-bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 12px;
      gap: 8px;
    }

    @media (max-width: 900px) {
      .${prefix}__field--horizontal {
        grid-template-columns: auto 10em;
      }

      .${prefix}__field-label-wrapper {
        max-width: 100%;
      }
    }

    @media (max-width: 350px) {
      .${prefix}__field--horizontal {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        gap: 0;
      }

      .${prefix}__field--checkbox {
        grid-template-columns: auto auto;
      }

      .${prefix}__field--checkbox,
      .${prefix}__group .${prefix}__field {
        grid-template-rows: 1fr;
        gap: .5em;
      }
    }
    `;
}
