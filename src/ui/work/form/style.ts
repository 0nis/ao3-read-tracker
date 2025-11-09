export const addFormStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    .ao3-mark-as-read__form {
      margin-top: 2em;
    }
    .ao3-mark-as-read__details-form textarea {
      width: 100%;
    }
    `;
  document.head.appendChild(style);
};
