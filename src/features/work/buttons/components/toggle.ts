import { ToggleButtonConfig } from "../types";
import { el } from "../../../../utils/ui/dom";

export function createToggleButton(
  id: string,
  config: ToggleButtonConfig,
  exists?: boolean
): HTMLButtonElement {
  const button = el("button", {
    textContent: exists ? config.labels.on : config.labels.off,
  });

  button.addEventListener("click", async (ev) => {
    ev.preventDefault();
    if (button.textContent === config.labels.on) {
      await config.onDeactivate(id, button);
      button.textContent = config.labels.off;
    } else {
      await config.onActivate(id, button);
      button.textContent = config.labels.on;
    }
  });

  return button;
}
