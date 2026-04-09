import { el } from "./dom";
import { warn } from "../../shared/extension/logger";
import { CLASS_PREFIX } from "../../constants/classes";

let srLive: HTMLElement | null = null;

export function initSrLive(): HTMLElement {
  if (srLive) return srLive;

  srLive = el("div", {
    id: `${CLASS_PREFIX}__sr-live`,
    className: `${CLASS_PREFIX}__sr-only`,
    attrs: {
      "aria-live": "polite",
    },
  });
  document.body.appendChild(srLive);
  return srLive;
}

export function reportSrLive(message: string): void {
  if (!srLive) {
    warn("SR live region not initialized");
    return;
  }

  srLive.textContent = "";
  setTimeout(() => {
    if (srLive) {
      srLive.textContent = message;
    }
  }, 100);
}

export function getSrLive(): HTMLElement | null {
  return srLive;
}
