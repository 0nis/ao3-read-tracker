export const getStyles = (prefix: string): string => {
  return `
    @media (max-width: 673px) {
      .${prefix}-label {
        padding-top: 0.643em;
      }
    }
  `;
};
