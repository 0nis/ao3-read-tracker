export const getFormStyles = (prefix: string): string => {
  return `
    .${prefix}__footnote {
      padding-bottom: 0.643em !important;
    }

    .${prefix}__form__group {
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
      align-items: center;
      width: 100%;
    }

    .${prefix}__form__group div {
      width: min-content;
      white-space: nowrap;
      padding-inline-start: 2px;
      padding-inline-end: 0;
    }

    .${prefix}__form__submit {
      display: flex;
      gap: .5em;
    }

    @media (max-width: 800px) {
      .${prefix}__form__group {
        flex-direction: column;
        align-items: flex-start;
      }

      .${prefix}__form__group div {
        width: 100%;
      }
    }
  `;
};
