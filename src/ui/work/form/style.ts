export const addFormStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    .ext-mar__footnote {
      padding-bottom: 0.643em !important;
    }
  `;
  document.head.appendChild(style);
};
