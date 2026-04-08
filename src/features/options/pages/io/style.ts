export function getStyles(prefix: string): string {
  return `
    .${prefix}__category {
        margin-top: 1.5em;
    }

    .${prefix}__category-title {
        font-weight: 600;
    }

    .${prefix}__category-description {
        opacity: 0.8;
        font-size: 0.95em;
    }

    .${prefix}__category-description ul,
    .${prefix}__category-description ol {
        list-style: initial; 
        margin: 0.5em 0 0.5em 1.5em;
    }

    .${prefix}__category-description li {
        list-style: initial;
        margin: 0.25em 0;
    }

    .${prefix}__category-actions {
        float: none !important;
        text-align: start !important;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5em;
    }

    .${prefix}__category-actions li {
        display: inline-block;
        margin: 0;
        padding: 0;
    }

    .${prefix}__category-warning {
        margin-top: 0.5em;
        margin-bottom: 0;
        opacity: 0.8;
        font-size: 0.90em;
        font-style: italic;
        color: #900;
    }
  `;
}
