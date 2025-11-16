import { CLASS_PREFIX } from "../../../constants/classes";

export const addFormStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__footnote {
      padding-bottom: 0.643em !important;
    }
    .${CLASS_PREFIX}__align-horizontally {
      display: inline-flex;
      flex-direction: row;
      gap: 1em;
      align-items: center;
      width: 100%;
    }
    .${CLASS_PREFIX}__align-horizontally div {
      width: min-content;
    }
  `;
  document.head.appendChild(style);
};
