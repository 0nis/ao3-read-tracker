import { CLASS_PREFIX } from "../constants/classes";

export function addStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
