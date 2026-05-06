import { WorkActionState } from "../../config";
import { OpenFormButtonConfig } from "../types";

import { ABBREVIATION } from "../../../../constants/global";
import { el } from "../../../../utils/dom";

export function createOpenFormButton(
  id: string,
  config: OpenFormButtonConfig,
  exists?: boolean,
): HTMLAnchorElement {
  const button = el("a", {
    href: "#",
    textContent: exists ? config.labels.on : config.labels.off,
  });

  document.addEventListener(`${ABBREVIATION}:updated`, (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    if (detail.workAction !== config.type || !detail.state) return;
    button.textContent =
      detail.state === WorkActionState.MARKED
        ? config.labels.on
        : config.labels.off;
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await config.onClick(id, button);
  });

  return button;
}
