import { createFocusTrap, FocusTrap } from "focus-trap";
import { createModal, createOverlay, ModalConfig } from "./modal";
import { addModalStyles } from "./styles";
import { CLASS_PREFIX } from "../../constants/classes";

let stylesInitialized = false;
let overlay: HTMLDivElement | null = null;

/**
 * Open a new confirmation modal dialog with the given configuration
 * @param config The title, message, button texts, and callbacks for the modal
 */
export function openModal(config: ModalConfig): void {
  ensureInitialized();

  const modal = createModal(config);
  document.body.appendChild(modal);

  const focusTrap = createFocusTrap(modal, {
    escapeDeactivates: true,
    clickOutsideDeactivates: true,
    onDeactivate: () => close(),
  });

  const close = createCloseHandler(modal, focusTrap);

  setupEventListeners(modal, config, close);
  showModal(modal, focusTrap);
}

function ensureInitialized(): void {
  if (!stylesInitialized) {
    addModalStyles();
    overlay = createOverlay();
    document.body.append(overlay);
    stylesInitialized = true;
  }
}

function setupEventListeners(
  modal: HTMLDivElement,
  config: ModalConfig,
  close: () => void
): void {
  const confirmBtn = modal.querySelector(
    `#${CLASS_PREFIX}__modal-confirm`
  ) as HTMLButtonElement;
  const cancelBtn = modal.querySelector(
    `#${CLASS_PREFIX}__modal-cancel`
  ) as HTMLButtonElement;

  confirmBtn?.addEventListener("click", async () => {
    await config.onConfirm?.();
    close();
  });

  cancelBtn?.addEventListener("click", async () => {
    await config.onCancel?.();
    close();
  });
}

function showModal(modal: HTMLDivElement, focusTrap: FocusTrap): void {
  modal.classList.remove(`${CLASS_PREFIX}__hidden`);
  overlay!.classList.remove(`${CLASS_PREFIX}__hidden`);
  focusTrap.activate();
}

function createCloseHandler(modal: HTMLDivElement, focusTrap: FocusTrap) {
  return () => {
    modal.classList.add(`${CLASS_PREFIX}__hidden`);
    overlay!.classList.add(`${CLASS_PREFIX}__hidden`);
    focusTrap.deactivate();
    setTimeout(() => modal.remove(), 300);
  };
}
