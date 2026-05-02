import { el, ensureChild } from "../dom";
import { getExtensionName, getManifest } from "../../shared/extension/manifest";

/**
 * Adds a reload button to the extension footer.
 * @param fn The function to call when the button is clicked
 */
export function addReloadButton(fn: () => void): void {
  const container = ensureReloadButtonContainer();
  if (!container) return;

  container.appendChild(createReloadButton(fn));
}

function createReloadButton(reload: () => void): HTMLElement {
  const name = `${getExtensionName()} Extension`;
  const btn = el("button", { className: "button" }, [`Reload ${name}`]);
  btn.onclick = () => reload();
  return btn;
}

function getNavigationActionsElement(): HTMLElement | null {
  const footer = document.getElementById("footer");
  if (!footer) return null;

  return footer.querySelector("ul.navigation.actions");
}

function ensureReloadButtonContainer(): HTMLElement | null {
  const actions = getNavigationActionsElement();
  if (!actions) return null;

  const container = ensureChild({
    parent: actions,
    className: "module group group--extensions",
    tag: "li",
  });

  const header = ensureChild({
    parent: container,
    className: "heading",
    tag: "h4",
  });
  if (!header.textContent) header.textContent = "Extensions";

  ensureChild({
    parent: container,
    className: "menu",
    tag: "ul",
  });

  return container;
}
