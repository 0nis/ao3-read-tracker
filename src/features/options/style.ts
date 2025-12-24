export function getStyles(prefix: string): string {
  return `
    .${prefix}__wrapper {
      display: grid;
      grid-template-rows: auto 1fr;
      grid-template-columns: 200px 1fr;
      gap: 24px;
    }

    .${prefix}__header {
      grid-column: 1 / -1;
    }

    .${prefix}__nav {
      grid-row: 2 / 3;
    }

    .${prefix}__content {
      grid-row: 2 / 3;
      grid-column: 2 / 3;
    }

    @media (max-width: 600px) {
      .${prefix}__wrapper {
        position: relative;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .${prefix}__content {
        grid-column: 1 / -1;
      }

      .${prefix}__nav {
        grid-row: auto;
      }
    }
  `;
}
