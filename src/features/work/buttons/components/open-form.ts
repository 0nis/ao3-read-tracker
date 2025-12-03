import { WorkActionState } from "../../config";
import { OpenFormButtonConfig } from "../types";

import { ABBREVIATION } from "../../../../constants/global";
import { el } from "../../../../utils/ui/dom";

export function createOpenFormButton(
  id: string,
  config: OpenFormButtonConfig,
  exists?: boolean
): HTMLAnchorElement {
  const button = el("a", {
    href: "#",
    textContent: exists ? config.labels.on : config.labels.off,
  });

  document.addEventListener(`${ABBREVIATION}:updated`, (ev: Event) => {
    const state = (ev as CustomEvent).detail?.state;
    if (!state) return;
    button.textContent =
      state === WorkActionState.MARKED ? config.labels.on : config.labels.off;
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await config.onClick(id, button);
  });

  return button;
}
