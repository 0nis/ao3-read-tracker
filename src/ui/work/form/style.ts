export const getFormStyles = (prefix: string): string => {
  return `
    .${prefix}__footnote {
      padding-bottom: 0.643em !important;
    }
    .${prefix}__align-horizontally {
      display: inline-flex;
      flex-direction: row;
      gap: 1em;
      align-items: center;
      width: 100%;
    }
    .${prefix}__align-horizontally div {
      width: min-content;
    }
  `;
};
