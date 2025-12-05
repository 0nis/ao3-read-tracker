import { WorkAction, WorkActionEvent } from "../../config";

import { getIdFromUrl } from "../../../../utils/ao3";
import { el } from "../../../../utils/ui/dom";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { ABBREVIATION } from "../../../../constants/global";

export function createUpdateButton(
  label: string,
  onClick: (id: string, btn: HTMLButtonElement) => Promise<void>,
  onUpdate?: (
    btn: HTMLButtonElement,
    workAction: WorkAction,
    workActionEvent: WorkActionEvent
  ) => void,
  hidden: boolean = false,
  attrs: Record<string, string> = {}
): HTMLButtonElement {
  const button = el("button", {
    textContent: label,
  });

  if (hidden) {
    button.classList.add(`${CLASS_PREFIX}__hidden`);
    button.setAttribute("aria-hidden", "true");
  }

  Object.entries(attrs).forEach(([key, value]) => {
    button.setAttribute(key, value);
  });

  document.addEventListener(`${ABBREVIATION}:updated`, (ev: Event) => {
    const workAction = (ev as CustomEvent).detail.workAction;
    const workActionEvent = (ev as CustomEvent).detail.workActionEvent;
    if (onUpdate) {
      onUpdate(button, workAction, workActionEvent);
    }
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const id = getIdFromUrl();
    if (!id) return;
    await onClick(id, button);
  });

  return button;
}
