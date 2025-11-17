import { CLASS_PREFIX } from "../../constants/classes";

export function addModalStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 98;
    }
    .${CLASS_PREFIX}__modal {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: inherit;
      color: inherit;
      padding: 20px;
      box-shadow: 0 0 30px;
      box-sizing: border-box;
      max-height: 100%;
      max-width: 100%;
      overflow: auto;
      z-index: 99;
    }
    .${CLASS_PREFIX}__modal-header {
      margin-bottom: 1em;
    }
    .${CLASS_PREFIX}__modal-message {
      margin-bottom: 1.5em;
    }
    .${CLASS_PREFIX}__modal-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .${CLASS_PREFIX}__modal-btn {
      padding: 8px 16px;
      border: 1px solid currentColor;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .${CLASS_PREFIX}__modal-btn:hover {
      opacity: 0.8;
    }
    .${CLASS_PREFIX}__modal-btn--primary {
      background: currentColor;
      color: var(--background, #fff);
    }
    .${CLASS_PREFIX}__hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
