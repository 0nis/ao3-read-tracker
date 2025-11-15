import { CLASS_PREFIX } from "../../../constants/classes";

export const addFormStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__footnote {
      padding-bottom: 0.643em !important;
    }
  `;
  document.head.appendChild(style);
};
