import { createFocusTrap, FocusTrap } from "focus-trap";
import { createModal, createOverlay } from "./modal";
import { addModalStyles } from "./styles";
import { addSettingsButton } from "./navigation";

interface SettingsState {
  modal: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  focusTrap: FocusTrap | null;
}

const state: SettingsState = {
  modal: null,
  overlay: null,
  focusTrap: null,
};

export const settings = {
  init() {
    addModalStyles();
    state.modal = createModal();
    state.overlay = createOverlay();
    document.body.append(state.modal, state.overlay);
    state.focusTrap = createFocusTrap(state.modal, {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      onDeactivate: () => this.close(),
    });
    addSettingsButton(this.open.bind(this));
  },
  open() {
    state.modal!.classList.remove("hidden");
    state.overlay!.classList.remove("hidden");
    state.focusTrap?.activate();
  },
  close() {
    state.modal!.classList.add("hidden");
    state.overlay!.classList.add("hidden");
    state.focusTrap?.deactivate();
  },
};
