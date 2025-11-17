import { CLASS_PREFIX } from "../../constants/classes";

export interface ModalConfig {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

export function createOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.className = `${CLASS_PREFIX}__modal-overlay`;
  overlay.classList.add(`${CLASS_PREFIX}__hidden`);
  return overlay;
}

export function createModal(config: ModalConfig): HTMLDivElement {
  const modal = document.createElement("div");
  modal.className = `${CLASS_PREFIX}__modal`;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", `${CLASS_PREFIX}__modal-heading`);
  modal.classList.add(`${CLASS_PREFIX}__hidden`);

  const messageHtml = config.message
    ? `<p class="${CLASS_PREFIX}__modal-message">${config.message}</p>`
    : "";
  const confirmText = config.confirmText || "Confirm";
  const cancelText = config.cancelText || "Cancel";

  modal.innerHTML = `
    <div class="${CLASS_PREFIX}__modal-header">
      <h3 id="${CLASS_PREFIX}__modal-heading" class="${CLASS_PREFIX}__modal-title">${config.title}</h3>
    </div>
    ${messageHtml}
    <div class="${CLASS_PREFIX}__modal-buttons">
      <button id="${CLASS_PREFIX}__modal-cancel" class="${CLASS_PREFIX}__modal-btn">${cancelText}</button>
      <button id="${CLASS_PREFIX}__modal-confirm" class="${CLASS_PREFIX}__modal-btn ${CLASS_PREFIX}__modal-btn--primary">${confirmText}</button>
    </div>
  `;

  return modal;
}
